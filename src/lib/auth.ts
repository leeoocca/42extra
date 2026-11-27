import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { genericOAuth } from 'better-auth/plugins';
import { getRequestEvent } from '$app/server';
import { BETTER_AUTH_42_SCHOOL_ID, BETTER_AUTH_42_SCHOOL_SECRET } from '$app/env/private';
import { PUBLIC_BETTER_AUTH_URL } from '$app/env/public';

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET || 'better-auth-secret-key-at-least-32-chars-long',
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		cookieCache: {
			enabled: true,
			strategy: 'jwe',
			maxAge: 60 * 60 * 24 * 7
		}
	},
	account: {
		storeAccountCookie: true
	},
	baseURL: PUBLIC_BETTER_AUTH_URL,
	trustedOrigins: [PUBLIC_BETTER_AUTH_URL || 'http://localhost:5173'],
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: '42',
					clientId: BETTER_AUTH_42_SCHOOL_ID || '',
					clientSecret: BETTER_AUTH_42_SCHOOL_SECRET || '',
					authorizationUrl: 'https://api.intra.42.fr/oauth/authorize',
					tokenUrl: 'https://api.intra.42.fr/oauth/token',
					userInfoUrl: 'https://api.intra.42.fr/v2/me',
					scopes: ['public', 'profile', 'projects'],
					mapProfileToUser: async (profile) => {
						const name =
							(profile.usual_full_name as string | undefined) ||
							(profile.login as string | undefined) ||
							(profile.displayname as string | undefined) ||
							profile.name ||
							'';
						const imgObj = profile.image as
							{ link?: string; versions?: { medium?: string; small?: string } } | undefined;
						const image =
							typeof profile.image === 'string'
								? profile.image
								: imgObj?.link || imgObj?.versions?.medium || imgObj?.versions?.small;
						return {
							email: profile.email,
							emailVerified: true,
							name,
							image
						};
					}
				}
			]
		}),
		sveltekitCookies(getRequestEvent)
	]
});
