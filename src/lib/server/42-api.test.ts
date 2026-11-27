import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('./tokens.ts', () => ({
	getUserBearerToken: vi.fn(),
	refresh42OAuthToken: vi.fn()
}));

import { fetchFtApiResponse, parseRetryAfterMs } from './42-api.ts';
import { getUserBearerToken, refresh42OAuthToken } from './tokens.ts';

function makeEvent(): RequestEvent {
	return {} as unknown as RequestEvent;
}

describe('parseRetryAfterMs', () => {
	it('parses numeric seconds', () => {
		expect(parseRetryAfterMs('2')).toBe(2000);
		expect(parseRetryAfterMs(' 0.5 ')).toBe(500);
		expect(parseRetryAfterMs('0')).toBe(0);
	});

	it('parses HTTP dates relative to now', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
		expect(parseRetryAfterMs('Thu, 01 Jan 2026 00:00:03 GMT')).toBe(3000);
		vi.useRealTimers();
	});

	it('returns null for missing or invalid headers', () => {
		expect(parseRetryAfterMs(null)).toBeNull();
		expect(parseRetryAfterMs('not-a-date')).toBeNull();
	});
});

describe('fetchFtApiResponse rate limiting and 429 retry', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
		vi.mocked(refresh42OAuthToken).mockReset();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.useRealTimers();
	});

	it('paces concurrent requests for the same user by at least 520ms', async () => {
		vi.mocked(getUserBearerToken).mockResolvedValue({
			token: 'tok-pace',
			account: { accountId: 'pace-user-1' }
		});

		const callTimes: number[] = [];
		globalThis.fetch = vi.fn(async () => {
			callTimes.push(Date.now());
			return new Response(JSON.stringify({ ok: true }), { status: 200 });
		}) as unknown as typeof fetch;

		const p1 = fetchFtApiResponse(makeEvent(), '/v2/events/1');
		const p2 = fetchFtApiResponse(makeEvent(), '/v2/events/2');
		const p3 = fetchFtApiResponse(makeEvent(), '/v2/events/3');

		await vi.runAllTimersAsync();
		await Promise.all([p1, p2, p3]);

		expect(callTimes).toHaveLength(3);
		expect(callTimes[1] - callTimes[0]).toBeGreaterThanOrEqual(520);
		expect(callTimes[2] - callTimes[1]).toBeGreaterThanOrEqual(520);
	});

	it('retries on 429 using Retry-After header', async () => {
		vi.mocked(getUserBearerToken).mockResolvedValue({
			token: 'tok-retry',
			account: { accountId: 'retry-user-1' }
		});

		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ message: 'Rate limited' }), {
					status: 429,
					headers: { 'Retry-After': '1' }
				})
			)
			.mockResolvedValueOnce(new Response(JSON.stringify({ id: 42 }), { status: 200 }));

		globalThis.fetch = fetchMock as unknown as typeof fetch;

		const promise = fetchFtApiResponse(makeEvent(), '/v2/events/42');
		await vi.runAllTimersAsync();
		const res = await promise;

		expect(res.status).toBe(200);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('returns 429 immediately if Retry-After exceeds cap', async () => {
		vi.mocked(getUserBearerToken).mockResolvedValue({
			token: 'tok-cap',
			account: { accountId: 'cap-user-1' }
		});

		const fetchMock = vi.fn().mockResolvedValueOnce(
			new Response(JSON.stringify({ message: 'Hourly quota exceeded' }), {
				status: 429,
				headers: { 'Retry-After': '3600' }
			})
		);

		globalThis.fetch = fetchMock as unknown as typeof fetch;

		const promise = fetchFtApiResponse(makeEvent(), '/v2/events/99');
		await vi.runAllTimersAsync();
		const res = await promise;

		expect(res.status).toBe(429);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
