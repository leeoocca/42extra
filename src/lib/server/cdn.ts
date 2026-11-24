import { error, type RequestEvent } from '@sveltejs/kit';
import { getUserBearerToken, refresh42OAuthToken } from './tokens.ts';

const ALLOWED_CDN_HOSTS = ['cdn.intra.42.fr'];

/**
 * Validates and normalizes target CDN URL to avoid open relay/SSRF.
 */
export function resolveTargetCdnUrl(target: string): URL {
	let parsedUrl: URL;

	if (target.startsWith('http://') || target.startsWith('https://')) {
		try {
			parsedUrl = new URL(target);
		} catch {
			throw error(400, 'Invalid CDN URL');
		}
	} else {
		// Treat relative paths as paths on 42 CDN
		const cleanPath = target.startsWith('/') ? target.slice(1) : target;
		parsedUrl = new URL(`https://cdn.intra.42.fr/${cleanPath}`);
	}

	const hostname = parsedUrl.hostname.toLowerCase();
	const isAllowed = ALLOWED_CDN_HOSTS.includes(hostname) || hostname.endsWith('.intra.42.fr');

	if (!isAllowed) {
		throw error(403, 'Forbidden: Only 42 CDN resources can be proxied');
	}

	return parsedUrl;
}

/**
 * Handles proxying a CDN request with the user's bearer token.
 * 42 CDN strictly requires passing the OAuth access token via Authorization header.
 */
export async function proxyCdnRequest(event: RequestEvent): Promise<Response> {
	// Find raw target from query param ?url= or ?path= or route params.path
	const urlParam = event.url.searchParams.get('url');
	const pathParam = event.url.searchParams.get('path');
	const routeParam = event.params.path;

	const rawTarget = urlParam || pathParam || routeParam;
	if (!rawTarget) {
		throw error(400, 'Missing image URL or path parameter');
	}

	const targetUrl = resolveTargetCdnUrl(rawTarget);

	// Get user's Bearer token
	const tokenResult = await getUserBearerToken(event);
	if (!tokenResult?.token) {
		throw error(401, 'Unauthorized: Valid user session or Bearer token is required');
	}

	let currentToken = tokenResult.token;

	const createHeaders = (token: string) => {
		const h = new Headers();
		h.set('Authorization', `Bearer ${token}`);

		const acceptHeader = event.request.headers.get('accept');
		if (acceptHeader) {
			h.set('Accept', acceptHeader);
		}

		const ifNoneMatch = event.request.headers.get('if-none-match');
		if (ifNoneMatch) {
			h.set('If-None-Match', ifNoneMatch);
		}

		const ifModifiedSince = event.request.headers.get('if-modified-since');
		if (ifModifiedSince) {
			h.set('If-Modified-Since', ifModifiedSince);
		}

		return h;
	};

	try {
		let upstreamResponse = await fetch(targetUrl.toString(), {
			method: 'GET',
			headers: createHeaders(currentToken)
		});

		// If upstream 42 CDN responded with 401 and we have refresh capability, try to refresh and retry
		if (upstreamResponse.status === 401 && tokenResult.account && tokenResult.authContext) {
			console.warn('[CDN Proxy] Upstream 42 CDN returned 401, attempting token refresh...');
			const refreshedToken = await refresh42OAuthToken(
				tokenResult.account,
				tokenResult.authContext
			);
			if (refreshedToken) {
				currentToken = refreshedToken;
				upstreamResponse = await fetch(targetUrl.toString(), {
					method: 'GET',
					headers: createHeaders(currentToken)
				});
			}
		}

		const responseHeaders = new Headers();

		const contentType = upstreamResponse.headers.get('content-type');
		if (contentType) {
			responseHeaders.set('Content-Type', contentType);
		}

		const contentLength = upstreamResponse.headers.get('content-length');
		if (contentLength) {
			responseHeaders.set('Content-Length', contentLength);
		}

		const etag = upstreamResponse.headers.get('etag');
		if (etag) {
			responseHeaders.set('ETag', etag);
		}

		const lastModified = upstreamResponse.headers.get('last-modified');
		if (lastModified) {
			responseHeaders.set('Last-Modified', lastModified);
		}

		const cacheControl = upstreamResponse.headers.get('cache-control');
		responseHeaders.set(
			'Cache-Control',
			cacheControl || 'private, max-age=86400, stale-while-revalidate=604800'
		);

		return new Response(upstreamResponse.body, {
			status: upstreamResponse.status,
			statusText: upstreamResponse.statusText,
			headers: responseHeaders
		});
	} catch (err: any) {
		if (err?.status) {
			throw err;
		}
		console.error('[CDN Proxy] Error communicating with CDN:', err);
		throw error(502, 'Bad Gateway: Error communicating with CDN');
	}
}
