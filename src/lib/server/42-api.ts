import { error, type RequestEvent } from '@sveltejs/kit';
import { getUserBearerToken, refresh42OAuthToken, type TokenResult } from './tokens.ts';
import {
	FtUserMeSchema,
	FtCampusListSchema,
	type FtUserMe,
	type FtCampus
} from '#lib/schemas/42.ts';
import type { z } from 'zod';

const FT_API_BASE_URL = 'https://api.intra.42.fr';

// 42 API v2 enforces ~2 req/s per token; space requests slightly above 500ms.
const MIN_REQUEST_INTERVAL_MS = 520;
const MAX_429_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;
const MAX_RETRY_WAIT_MS = 10_000;

interface RateLimitState {
	tail: Promise<void>;
	nextAvailableAt: number;
}

const rateLimitQueues = new Map<string, RateLimitState>();

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseRetryAfterMs(headerValue: string | null): number | null {
	if (!headerValue) return null;
	const trimmed = headerValue.trim();
	const seconds = Number(trimmed);
	if (Number.isFinite(seconds) && seconds >= 0) {
		return Math.ceil(seconds * 1000);
	}
	const targetTime = Date.parse(trimmed);
	if (!Number.isNaN(targetTime)) {
		return Math.max(0, targetTime - Date.now());
	}
	return null;
}

function getRateLimitKey(tokenResult: TokenResult): string {
	return String(tokenResult.account?.accountId ?? tokenResult.token);
}

function getOrCreateQueueState(key: string): RateLimitState {
	let state = rateLimitQueues.get(key);
	if (!state) {
		if (rateLimitQueues.size > 200) {
			const staleCutoff = Date.now() - 60_000;
			for (const [k, v] of rateLimitQueues) {
				if (v.nextAvailableAt < staleCutoff) {
					rateLimitQueues.delete(k);
				}
			}
		}
		state = { tail: Promise.resolve(), nextAvailableAt: 0 };
		rateLimitQueues.set(key, state);
	}
	return state;
}

function pushBackKeyCooldown(key: string, delayMs: number): void {
	const state = getOrCreateQueueState(key);
	state.nextAvailableAt = Math.max(state.nextAvailableAt, Date.now() + delayMs);
}

function scheduleForKey<T>(key: string, fn: () => Promise<T>): Promise<T> {
	const state = getOrCreateQueueState(key);
	const run = state.tail.then(async () => {
		const waitMs = state.nextAvailableAt - Date.now();
		if (waitMs > 0) {
			await sleep(waitMs);
		}
		state.nextAvailableAt = Date.now() + MIN_REQUEST_INTERVAL_MS;
		return fn();
	});
	state.tail = run.then(
		() => undefined,
		() => undefined
	);
	return run;
}

export interface FetchFtApiOptions<T> {
	schema?: z.ZodType<T>;
	searchParams?: Record<string, string | number | boolean | undefined>;
	fetchOptions?: RequestInit;
}

/**
 * Generic helper to make authenticated requests to 42 API.
 * Automatically handles:
 * - Bearer token acquisition
 * - Per-user request pacing (~2 req/s)
 * - Appending query parameters
 * - Upstream 401 retry with OAuth refresh token
 * - Upstream 429 retry with Retry-After / jittered exponential backoff
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
	const rateLimitKey = getRateLimitKey(tokenResult);

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

	const executeUpstreamFetch = (token: string) =>
		scheduleForKey(rateLimitKey, () =>
			fetch(url.toString(), {
				...options?.fetchOptions,
				method: options?.fetchOptions?.method || 'GET',
				headers: createHeaders(token)
			})
		);

	let res = await executeUpstreamFetch(currentToken);
	let hasRefreshed = false;

	for (let attempt = 0; attempt <= MAX_429_RETRIES; attempt++) {
		if (
			res.status === 401 &&
			!hasRefreshed &&
			tokenResult.account &&
			tokenResult.authContext
		) {
			hasRefreshed = true;
			console.warn(`[42 API] Upstream ${cleanEndpoint} returned 401, refreshing token...`);
			const refreshedToken = await refresh42OAuthToken(
				tokenResult.account,
				tokenResult.authContext
			);
			if (refreshedToken) {
				currentToken = refreshedToken;
				res = await executeUpstreamFetch(currentToken);
				continue;
			}
		}

		if (
			res.status === 429 &&
			attempt < MAX_429_RETRIES &&
			!options?.fetchOptions?.signal?.aborted
		) {
			const retryAfterMs = parseRetryAfterMs(res.headers.get('retry-after'));
			const baseDelay = retryAfterMs ?? BASE_RETRY_DELAY_MS * 2 ** attempt;
			const jitter = Math.floor(Math.random() * 200);
			const delayMs = baseDelay + jitter;

			if (delayMs > MAX_RETRY_WAIT_MS) {
				console.warn(
					`[42 API] Upstream ${cleanEndpoint} returned 429 with ${delayMs}ms wait (exceeds cap); returning 429.`
				);
				break;
			}

			pushBackKeyCooldown(rateLimitKey, delayMs);
			console.warn(
				`[42 API] Upstream ${cleanEndpoint} returned 429, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_429_RETRIES})...`
			);
			await sleep(delayMs);
			res = await executeUpstreamFetch(currentToken);
			continue;
		}

		break;
	}

	// Note: We return raw fetch response (even if !res.ok) so consumers like API proxy can forward the status code
	// without throwing an unhandled 500 error.
	if (!res.ok) {
		const errorBody = await res
			.clone()
			.text()
			.catch(() => '');
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
