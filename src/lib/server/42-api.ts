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
export async function fetchFtApi<T = unknown>(
	event: RequestEvent,
	endpoint: string,
	options?: FetchFtApiOptions<T>
): Promise<T> {
	const tokenResult = await getUserBearerToken(event);
	if (!tokenResult?.token) {
		throw error(401, 'Unauthorized: Valid user session or Bearer token is required');
	}

	let currentToken = tokenResult.token;

	// Normalize endpoint (ensure leading slash, support /v2/... or v2/...)
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

	try {
		let res = await fetch(url.toString(), {
			...options?.fetchOptions,
			method: options?.fetchOptions?.method || 'GET',
			headers: createHeaders(currentToken)
		});

		// Auto-refresh token on upstream 401
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
					`[42 API] Zod validation warning for ${cleanEndpoint}:`,
					JSON.stringify(parseResult.error.format(), null, 2)
				);
				// Resilient fallback to avoid breaking UI on new/unexpected upstream fields
				return rawJson as T;
			}
			return parseResult.data;
		}

		return rawJson as T;
	} catch (err: any) {
		if (err?.status) {
			throw err;
		}
		console.error(`[42 API] Error communicating with ${cleanEndpoint}:`, err);
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
