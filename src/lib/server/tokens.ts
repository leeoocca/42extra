import { auth } from '#lib/auth.ts';
import { BETTER_AUTH_42_SCHOOL_ID, BETTER_AUTH_42_SCHOOL_SECRET } from '$app/env/private';
import type { RequestEvent } from '@sveltejs/kit';
import { getAccountCookie, setAccountCookie } from 'better-auth/cookies';

export interface TokenResult {
	token: string;
	account?: any;
	authContext?: any;
}

/**
 * Creates an endpoint context for Better Auth cookie extraction and updates.
 */
export function getEndpointContext(event: RequestEvent, ctx: any) {
	return {
		context: ctx,
		headers: event.request.headers,
		getCookie: (name: string) => event.cookies.get(name),
		setCookie: (name: string, value: string, attributes: any) => {
			event.cookies.set(name, value, attributes);
		}
	};
}

/**
 * Refreshes an expired 42 OAuth access token using the refresh_token grant.
 * Updates the stateless encrypted account cookie with the refreshed token.
 */
export async function refresh42OAuthToken(account: any, endpointCtx: any): Promise<string | null> {
	if (!account?.refreshToken) return null;

	try {
		const res = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				client_id: BETTER_AUTH_42_SCHOOL_ID || '',
				client_secret: BETTER_AUTH_42_SCHOOL_SECRET || '',
				refresh_token: account.refreshToken
			})
		});

		if (!res.ok) {
			console.warn('[42 Auth] Failed to refresh 42 OAuth token, status:', res.status);
			return null;
		}

		const data = await res.json();
		if (data.access_token) {
			const updated = {
				...account,
				accessToken: data.access_token,
				refreshToken: data.refresh_token || account.refreshToken,
				accessTokenExpiresAt: data.expires_in
					? new Date(Date.now() + data.expires_in * 1000)
					: undefined
			};

			account.accessToken = updated.accessToken;
			if (updated.refreshToken) account.refreshToken = updated.refreshToken;
			account.accessTokenExpiresAt = updated.accessTokenExpiresAt;

			// Update in stateless encrypted account cookie
			if (endpointCtx?.context) {
				try {
					await setAccountCookie(endpointCtx as any, updated);
				} catch (e) {
					console.warn('[42 Auth] Failed to set account cookie during refresh:', e);
				}
			}

			// If internalAdapter exists in context, update it as well
			if (endpointCtx?.internalAdapter && account.id) {
				try {
					await endpointCtx.internalAdapter.updateAccount(account.id, updated);
				} catch {
					// Safe ignore in stateless mode
				}
			}

			return data.access_token;
		}
	} catch (err) {
		console.error('[42 Auth] Error during 42 token refresh:', err);
	}

	return null;
}

/**
 * Resolves the user's OAuth access token:
 * 1. Directly from the Authorization header (Bearer or raw).
 * 2. Directly from query parameters (?token=... or ?bearer=...).
 * 3. From the stateless encrypted JWE account cookie (with automatic refresh if expired).
 */
export async function getUserBearerToken(event: RequestEvent): Promise<TokenResult | null> {
	// 1. Direct token in incoming Authorization header
	const authHeader = event.request.headers.get('authorization');
	if (authHeader) {
		const token = authHeader.toLowerCase().startsWith('bearer ')
			? authHeader.slice(7).trim()
			: authHeader.trim();
		if (token) return { token };
	}

	// 2. Direct token in query params
	const queryToken = event.url.searchParams.get('token') || event.url.searchParams.get('bearer');
	if (queryToken) {
		return { token: queryToken.trim() };
	}

	// 3. Resolve user from locals or Better Auth session
	let user = event.locals.user;
	if (!user) {
		try {
			const sessionRes = await auth.api.getSession({ headers: event.request.headers });
			user = sessionRes?.user;
		} catch (err) {
			console.warn('[42 Auth] Failed to fetch session from Better Auth:', err);
		}
	}

	if (!user) {
		return null;
	}

	try {
		const ctx = await auth.$context;
		const endpointContext = getEndpointContext(event, ctx);

		// 4. Retrieve account from the stateless encrypted JWE cookie
		let account = await getAccountCookie(endpointContext as any);

		// Fallback: check internalAdapter if cookie was not present
		if (!account) {
			if (user.id !== undefined && user.id !== null) {
				const accounts = await ctx.internalAdapter.findAccounts(String(user.id));
				if (accounts && accounts.length > 0) {
					account = accounts.find((a: any) => a.providerId === '42') ?? accounts[0];
				}
			}
		}

		if (!account) {
			console.warn('[42 Auth] 401: No OAuth account found for user ID:', user.id);
			return null;
		}

		// 5. Check if token is expired (< 30s remaining) and refresh if possible
		const isExpired =
			account.accessTokenExpiresAt &&
			new Date(account.accessTokenExpiresAt).getTime() - Date.now() < 30_000;

		if (isExpired && account.refreshToken) {
			const refreshed = await refresh42OAuthToken(account, endpointContext);
			if (refreshed) {
				return { token: refreshed, account, authContext: endpointContext };
			}
		}

		if (account.accessToken) {
			return { token: account.accessToken, account, authContext: endpointContext };
		} else {
			console.warn('[42 Auth] 401: Account found but has no accessToken');
		}
	} catch (err) {
		console.error('[42 Auth] Failed to retrieve user OAuth token:', err);
	}

	return null;
}
