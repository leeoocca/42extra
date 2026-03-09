import { AUTH_42_SCHOOL_ID, AUTH_42_SCHOOL_SECRET } from '$env/static/private';
import { SvelteKitAuth } from '@auth/sveltekit';
import FortyTwo from '@auth/sveltekit/providers/42-school';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [FortyTwo],
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account) {
				// First-time login, save the `access_token`, its expiry and the `refresh_token`
				return {
					...token,
					access_token: account.access_token,
					expires_at: account.expires_at,
					refresh_token: account.refresh_token,
					user: {
						id: profile?.id
					}
				};
			} else if (Date.now() < token.expires_at * 1000) {
				// Subsequent logins, but the `access_token` is still valid
				return token;
			} else {
				// Subsequent logins, but the `access_token` has expired, try to refresh it
				if (!token.refresh_token) throw new TypeError('Missing refresh_token');

				try {
					const response = await fetch('https://api.intra.42.fr/oauth/token', {
						method: 'POST',
						body: new URLSearchParams({
							client_id: AUTH_42_SCHOOL_ID!,
							client_secret: AUTH_42_SCHOOL_SECRET!,
							grant_type: 'refresh_token',
							refresh_token: token.refresh_token!
						})
					});

					const tokensOrError = await response.json();

					if (!response.ok) throw tokensOrError;

					const newTokens = tokensOrError as {
						access_token: string;
						expires_in: number;
						refresh_token?: string;
					};

					return {
						...token,
						access_token: newTokens.access_token,
						expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
						// Some providers only issue refresh tokens once, so preserve if we did not get a new one
						refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token
					};
				} catch (error) {
					console.error('Error refreshing access_token', error);
					// If we fail to refresh the token, return an error so we can handle it on the page
					token.error = 'RefreshTokenError';
					return token;
				}
			}
		},
		async session({ session, token }) {
			session.error = token.error;
			session.access_token = token.access_token;
			session.userId = token.user.id;
			return session;
		}
	}
});

declare module '@auth/sveltekit' {
	interface Session {
		error?: 'RefreshTokenError';
		access_token: string;
		userId: string;
	}
}

declare module '@auth/core/jwt' {
	interface JWT {
		access_token: string;
		expires_at: number;
		refresh_token?: string;
		user: { id: string };
		error?: 'RefreshTokenError';
	}
}

// async function refreshAccessToken(token) {
// 	try {
// 		const url =
// 			`https://api.intra.42.fr/oauth/token?` +
// 			new URLSearchParams({
// 				client_id: process.env.AUTH_42_SCHOOL_ID,
// 				client_secret: process.env.FT_SECRET,
// 				grant_type: 'refresh_token',
// 				refresh_token: token.refreshToken,
// 				redirect_uri: process.env.FT_REDIRECT
// 			});

// 		const response = await fetch(url, {
// 			headers: {
// 				'Content-Type': 'application/x-www-form-urlencoded',
// 				Authorization: `Bearer ${token.accessToken}`
// 			},
// 			method: 'POST'
// 		});

// 		const refreshedTokens = await response.json();

// 		if (!response.ok) {
// 			throw refreshedTokens;
// 		}

// 		return {
// 			...token,
// 			accessToken: refreshedTokens.access_token,
// 			expires: refreshedTokens.created_at + refreshedTokens.expires_in,
// 			refreshToken: refreshedTokens.refresh_token
// 		};
// 	} catch (error) {
// 		console.error(error);

// 		return {
// 			...token,
// 			error: 'RefreshAccessTokenError'
// 		};
// 	}
// }
