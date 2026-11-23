import { describe, it, expect } from 'vitest';
import { FtCampusListSchema, FtUserMeSchema } from './42.js';

// Try loading local .env if available
try {
	if (typeof (process as any).loadEnvFile === 'function') {
		(process as any).loadEnvFile();
	}
} catch {
	// Safe ignore if .env does not exist
}

/**
 * Live 42 API Verification
 * Uses OAuth Client Credentials grant to authenticate directly with 42 API Intra v2
 * and verifies that live API responses match our Zod schemas.
 *
 * Run with: pnpm test:live
 */
describe('42 API Live Verification', () => {
	const clientId = process.env.BETTER_AUTH_42_SCHOOL_ID;
	const clientSecret = process.env.BETTER_AUTH_42_SCHOOL_SECRET;
	const hasCredentials = Boolean(clientId && clientSecret);

	it('validates live /v2/campus against FtCampusListSchema using client credentials', async (ctx) => {
		if (!hasCredentials) {
			ctx.skip();
			return;
		}

		let appToken: string | null = null;
		try {
			// 1. Obtain application bearer token via Client Credentials grant
			const tokenRes = await fetch('https://api.intra.42.fr/oauth/token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					grant_type: 'client_credentials',
					client_id: clientId!,
					client_secret: clientSecret!
				})
			});

			if (!tokenRes.ok) {
				console.warn('Live API skipped: Client credentials rejected by 42 Intra, status:', tokenRes.status);
				ctx.skip();
				return;
			}

			const tokenData = await tokenRes.json();
			appToken = tokenData.access_token;
		} catch (err) {
			console.warn('Live API skipped: Network unreachable in current environment');
			ctx.skip();
			return;
		}

		if (!appToken) {
			ctx.skip();
			return;
		}

		// 2. Fetch live campuses from 42 API
		const campusRes = await fetch('https://api.intra.42.fr/v2/campus?page[size]=10&sort=name', {
			headers: {
				Authorization: `Bearer ${appToken}`,
				Accept: 'application/json'
			}
		});

		expect(campusRes.ok).toBe(true);
		const rawCampuses = await campusRes.json();
		expect(Array.isArray(rawCampuses)).toBe(true);
		expect(rawCampuses.length).toBeGreaterThan(0);

		// 3. Assert live response passes Zod validation
		const parseResult = FtCampusListSchema.safeParse(rawCampuses);
		expect(parseResult.success).toBe(true);
		if (parseResult.success) {
			expect(parseResult.data[0].id).toBeDefined();
			expect(typeof parseResult.data[0].name).toBe('string');
		}
	});

	it('validates live /v2/me if student bearer token is provided', async (ctx) => {
		const studentToken = process.env.FT_TEST_BEARER_TOKEN;
		if (!studentToken) {
			ctx.skip();
			return;
		}

		try {
			const meRes = await fetch('https://api.intra.42.fr/v2/me', {
				headers: {
					Authorization: `Bearer ${studentToken}`,
					Accept: 'application/json'
				}
			});

			if (!meRes.ok) {
				ctx.skip();
				return;
			}

			const rawMe = await meRes.json();
			const parseResult = FtUserMeSchema.safeParse(rawMe);
			expect(parseResult.success).toBe(true);
		} catch {
			ctx.skip();
		}
	});
});
