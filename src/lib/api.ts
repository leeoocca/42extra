/**
 * 42 API Wrapper with Rate Limiting (2/sec), Caching, and Pagination
 */

import { writable, get } from 'svelte/store';

const API_BASE = 'https://api.intra.42.fr';
const RATE_LIMIT_PER_SECOND = 2;
const MIN_REQUEST_GAP_MS = 1000 / RATE_LIMIT_PER_SECOND; // 500ms

// ============================================================================
// Endpoint Normalization (pure endpoint path)
// ============================================================================

/**
 * Normalize endpoint to pure path (strips URL, removes v2/ prefix)
 * Examples: "me" → "me", "v2/me" → "me", "https://api.intra.42.fr/v2/me" → "me"
 */
function normalizeEndpoint(endpoint: string): string {
	return endpoint
		.replace(/^https:\/\/api\.intra\.42\.fr\//, '') // Remove absolute URL prefix
		.replace(/^\//, '') // Remove leading slash
		.replace(/^v2\//, ''); // Remove v2/ prefix
}

/**
 * Build full API URL with v2 prefix for actual requests
 */
function buildApiUrl(endpoint: string, params?: Record<string, any>): string {
	let url = `${API_BASE}/v2/${endpoint}`;

	if (params && Object.keys(params).length > 0) {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				searchParams.set(key, String(value));
			}
		});
		url += '?' + searchParams.toString();
	}

	return url;
}

// ============================================================================
// Rate Limiter
// ============================================================================

class RateLimiter {
	private requestTimestamps: number[] = [];

	async waitForSlot(): Promise<void> {
		const now = Date.now();

		// Remove timestamps older than 1 second
		this.requestTimestamps = this.requestTimestamps.filter((ts) => now - ts < 1000);

		// If we already have 2 requests within the last second, wait
		if (this.requestTimestamps.length >= RATE_LIMIT_PER_SECOND) {
			const oldestRequestTime = this.requestTimestamps[0];
			const timeToWait = 1000 - (now - oldestRequestTime);

			if (timeToWait > 0) {
				await new Promise((resolve) => setTimeout(resolve, timeToWait));
			}
		}

		// Record this request timestamp
		this.requestTimestamps.push(Date.now());
	}
}

const rateLimiter = new RateLimiter();

// ============================================================================
// Request Deduplication (in-flight request tracking)
// ============================================================================

const inFlightRequests = new Map<string, Promise<any>>();

// ============================================================================
// Cache
// ============================================================================

interface CacheEntry<T> {
	data: T;
	timestamp: number;
	pagination?: {
		page: number;
		per_page: number;
		total: number;
	};
}

const cache = new Map<string, CacheEntry<any>>();

function getCacheKey(endpoint: string, params?: Record<string, any>): string {
	const normalizedEndpoint = normalizeEndpoint(endpoint);

	if (!params || Object.keys(params).length === 0) {
		return normalizedEndpoint;
	}

	// Create sorted query string for consistent cache keys
	const searchParams = new URLSearchParams();
	Object.entries(params)
		.sort(([a], [b]) => a.localeCompare(b))
		.forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				searchParams.set(key, String(value));
			}
		});

	return `${normalizedEndpoint}?${searchParams.toString()}`;
}

function getFromCache<T>(cacheKey: string): T | null {
	const entry = cache.get(cacheKey);
	return entry ? entry.data : null;
}

function setCache<T>(cacheKey: string, data: T, pagination?: CacheEntry<T>['pagination']): void {
	cache.set(cacheKey, {
		data,
		timestamp: Date.now(),
		pagination
	});
}

export function clearCache(endpoint?: string): void {
	if (!endpoint) {
		cache.clear();
		return;
	}

	const normalizedEndpoint = normalizeEndpoint(endpoint);

	// Clear all entries that start with this endpoint
	for (const key of cache.keys()) {
		if (key.startsWith(normalizedEndpoint)) {
			cache.delete(key);
		}
	}
}

// ============================================================================
// Endpoint Tracking (for UI debugging/monitoring)
// ============================================================================

const trackedEndpointsMap = new Map<string, { status: number; timestamp: number }>(); // endpoint name -> {status, timestamp}
const trackedEndpointsStore = writable<Array<{ name: string; status: number }>>([]);

export interface TrackedEndpoint {
	name: string;
	status: number;
}

function updateTrackedEndpointsStore() {
	const endpoints = Array.from(trackedEndpointsMap.entries())
		.map(([name, { status }]) => ({ name, status }))
		.sort((a, b) => {
			// Get timestamps for sorting (most recent first)
			const aTime = trackedEndpointsMap.get(a.name)?.timestamp || 0;
			const bTime = trackedEndpointsMap.get(b.name)?.timestamp || 0;
			return bTime - aTime; // Reverse chronological
		});
	trackedEndpointsStore.set(endpoints);
}

export function trackEndpoint(endpoint: string, status: number): void {
	const normalized = normalizeEndpoint(endpoint);
	trackedEndpointsMap.set(normalized, { status, timestamp: Date.now() });
	updateTrackedEndpointsStore();
}

export function getTrackedEndpoints(): string[] {
	return Array.from(trackedEndpointsMap.keys()).sort();
}

export function getTrackedEndpointsWithStatus(): TrackedEndpoint[] {
	return get(trackedEndpointsStore);
}

export function subscribeTrackedEndpoints(callback: (endpoints: TrackedEndpoint[]) => void) {
	return trackedEndpointsStore.subscribe(callback);
}

export function clearTrackedEndpoints(): void {
	trackedEndpointsMap.clear();
	updateTrackedEndpointsStore();
}

export function refreshEndpoint(endpoint: string): void {
	clearCache(endpoint);
}

export function refreshAll(): void {
	clearCache();
	inFlightRequests.clear();
}

// ============================================================================
// Pagination Handler
// ============================================================================

interface PaginationParams {
	page?: number;
	per_page?: number;
}

interface PaginationMetadata {
	page: number;
	per_page: number;
	total: number;
	totalPages?: number;
}

interface PaginatedResponse {
	data: any[];
	pagination: PaginationMetadata;
}

async function fetchWithPagination<T extends any[]>(
	endpoint: string,
	options: FetchOptions,
	initialParams: PaginationParams,
	authFetch: typeof fetch,
	accessToken: string
): Promise<{ data: T; pagination: PaginationMetadata }> {
	const allResults: any[] = [];
	let page = initialParams.page || 1;
	const per_page = initialParams.per_page || 30;
	let totalPages = 1;

	while (page <= totalPages) {
		const pageParams = {
			...options.params,
			page,
			per_page
		};

		const pageUrl = buildApiUrl(endpoint, pageParams);
		const response = await authFetch(pageUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			signal: options.signal
		});

		if (!response.ok) {
			throw new Error(`42 API Error: ${response.status} ${response.statusText} on ${endpoint}`);
		}

		const data = await response.json();
		allResults.push(...(Array.isArray(data) ? data : [data]));

		// Extract pagination info from headers
		const total = parseInt(response.headers.get('x-total') || '0');
		const returnedPage = parseInt(response.headers.get('x-page') || String(page));
		const returnedPerPage = parseInt(response.headers.get('x-per-page') || String(per_page));

		totalPages = Math.ceil(total / returnedPerPage) || 1;

		page++;

		// Rate limit between pages
		if (page <= totalPages) {
			await rateLimiter.waitForSlot();
		}
	}

	return {
		data: allResults as T,
		pagination: {
			page: initialParams.page || 1,
			per_page,
			total: parseInt(
				String(cache.get(getCacheKey(endpoint, options.params))?.pagination?.total || '0'),
				10
			)
		}
	};
}

// ============================================================================
// URL Builder
// ============================================================================

// Main API Fetch Function
// ============================================================================

export interface FetchOptions {
	params?: Record<string, any>;
	fetch?: typeof globalThis.fetch;
	method?: string;
	body?: any;
	signal?: AbortSignal;
}

export async function fetch42<T = any>(
	endpoint: string,
	options: FetchOptions & { accessToken: string }
): Promise<T> {
	const {
		accessToken,
		fetch: authFetch = globalThis.fetch,
		params,
		method = 'GET',
		body,
		signal
	} = options;

	// Normalize endpoint to pure path (strip URL, remove v2/)
	const cleanEndpoint = normalizeEndpoint(endpoint);

	// Build cache key (without pagination params for generic caching)
	const cacheKey = getCacheKey(cleanEndpoint, params);

	// Check if we have it in cache and it's not a paginated request
	const hasPaginationParam = params?.page || params?.per_page;
	if (method === 'GET' && !hasPaginationParam) {
		const cached = getFromCache<T>(cacheKey);
		if (cached) {
			return cached;
		}
	}

	// Check if this request is already in-flight
	if (method === 'GET' && inFlightRequests.has(cacheKey)) {
		return inFlightRequests.get(cacheKey) as Promise<T>;
	}

	// Track endpoint as pending only when starting a new request
	trackEndpoint(cleanEndpoint, 0);

	// Create a promise chain to execute this request
	const requestPromise = (async () => {
		try {
			// Rate limit
			await rateLimiter.waitForSlot();

			// Build full API URL with v2 prefix
			const url = buildApiUrl(cleanEndpoint, params);

			// Handle paginated requests
			if (method === 'GET' && (params?.page !== undefined || params?.per_page !== undefined)) {
				const paginationParams: PaginationParams = {
					page: params?.page,
					per_page: params?.per_page
				};

				const result = await fetchWithPagination(
					cleanEndpoint,
					options,
					paginationParams,
					authFetch,
					accessToken
				);

				setCache(cacheKey, result, result.pagination);
				return result as T;
			}

			// Single request fetch
			const response = await authFetch(url, {
				method,
				headers: {
					Authorization: `Bearer ${accessToken}`,
					...(body && { 'Content-Type': 'application/json' })
				},
				...(body && { body: JSON.stringify(body) }),
				signal
			});

			if (!response.ok) {
				throw new Error(`42 API Error: ${response.status} ${response.statusText} on ${endpoint}`);
			}

			const data = await response.json();

			// Track endpoint with status code
			trackEndpoint(cleanEndpoint, response.status);

			// Cache the result
			setCache(cacheKey, data);

			return data as T;
		} finally {
			// Remove from in-flight tracking when complete
			inFlightRequests.delete(cacheKey);
		}
	})();

	// Track this request as in-flight (only for GET requests)
	if (method === 'GET') {
		inFlightRequests.set(cacheKey, requestPromise);
	}

	return requestPromise;
}
