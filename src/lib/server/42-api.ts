import { error, type RequestEvent } from '@sveltejs/kit';
import { getUserBearerToken, refresh42OAuthToken } from './tokens.ts';
import { FtUserMeSchema, FtCampusListSchema, type FtUserMe, type FtCampus } from '#lib/schemas/42.ts';
import type { z } from 'zod';

const FT_API_BASE_URL = 'https://api.intra.42.fr';

export interface FetchFtApiOptions<T> {
	schema?: z.ZodType<T>;
	searchParams?: Record<string, string | number | boolean | undefined>;
	fetchOptions?: RequestInit;
}

/**
 * Generic helper to make authenticated requests to 42 API.
 * Automatically handles:
 * - Bearer token acquisition
 * - Appending query parameters
 * - Upstream 401 retry with OAuth refresh token
 * - Error reporting and throwing SvelteKit HTTP errors
 * - Optional Zod schema validation with resilient fallback
 */
/**
 * Raw response helper to make authenticated requests to 42 API.
 * Returns the raw fetch Response object (preserving headers like x-total, x-page, etc.)
 */
export async function fetchFtApiResponse(
	event: RequestEvent,
	endpoint: string,
	options?: FetchFtApiOptions<any>
): Promise<Response> {
	const tokenResult = await getUserBearerToken(event);
	if (!tokenResult?.token) {
		throw error(401, 'Unauthorized: Valid user session or Bearer token is required');
	}

	let currentToken = tokenResult.token;

	const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const url = new URL(`${FT_API_BASE_URL}${cleanEndpoint}`);

	if (options?.searchParams) {
		for (const [key, value] of Object.entries(options.searchParams)) {
			if (value !== undefined) {
				url.searchParams.set(key, String(value));
			}
		}
	}

	const createHeaders = (token: string) => {
		const headers = new Headers(options?.fetchOptions?.headers);
		headers.set('Authorization', `Bearer ${token}`);
		headers.set('Accept', 'application/json');
		return headers;
	};

	let res = await fetch(url.toString(), {
		...options?.fetchOptions,
		method: options?.fetchOptions?.method || 'GET',
		headers: createHeaders(currentToken)
	});

	if (res.status === 401 && tokenResult.account && tokenResult.authContext) {
		console.warn(`[42 API] Upstream ${cleanEndpoint} returned 401, refreshing token...`);
		const refreshedToken = await refresh42OAuthToken(
			tokenResult.account,
			tokenResult.authContext
		);
		if (refreshedToken) {
			currentToken = refreshedToken;
			res = await fetch(url.toString(), {
				...options?.fetchOptions,
				method: options?.fetchOptions?.method || 'GET',
				headers: createHeaders(currentToken)
			});
		}
	}

	// Note: We return raw fetch response (even if !res.ok) so consumers like API proxy can forward the status code
	// without throwing an unhandled 500 error.
	if (!res.ok) {
		const errorBody = await res.clone().text().catch(() => '');
		console.warn(`[42 API] Upstream ${cleanEndpoint} returned status ${res.status}:`, errorBody);
	}

	return res;
}

export async function fetchFtApi<T = unknown>(
	event: RequestEvent,
	endpoint: string,
	options?: FetchFtApiOptions<T>
): Promise<T> {
	try {
		const res = await fetchFtApiResponse(event, endpoint, options);

		if (!res.ok) {
			const errorBody = await res.text().catch(() => '');
			console.error(`[42 API] Request failed: ${res.status} ${res.statusText}`, errorBody);
			throw error(res.status, `42 API request failed: ${res.statusText}`);
		}

		const rawJson = await res.json();

		if (options?.schema) {
			const parseResult = options.schema.safeParse(rawJson);
			if (!parseResult.success) {
				console.warn(
					`[42 API] Zod validation warning for ${endpoint}:`,
					JSON.stringify(parseResult.error.format(), null, 2)
				);
				return rawJson as T;
			}
			return parseResult.data;
		}

		return rawJson as T;
	} catch (err: any) {
		if (err?.status) {
			throw err;
		}
		console.error(`[42 API] Error communicating with ${endpoint}:`, err);
		throw error(502, 'Bad Gateway: Error communicating with 42 API');
	}
}

/**
 * Fetches the authenticated student's profile from 42 API (/v2/me)
 */
export async function fetchFtUserMe(event: RequestEvent): Promise<FtUserMe> {
	return fetchFtApi<FtUserMe>(event, '/v2/me', { schema: FtUserMeSchema });
}

/**
 * Fetches the list of all 42 network campuses from 42 API (/v2/campus)
 */
export async function fetchFtCampuses(event: RequestEvent): Promise<FtCampus[]> {
	return fetchFtApi<FtCampus[]>(event, '/v2/campus', {
		schema: FtCampusListSchema,
		searchParams: { 'page[size]': 100, sort: 'name' }
	});
}
