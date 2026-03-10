import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { genericOAuth } from 'better-auth/plugins';
import { getRequestEvent } from '$app/server';
import { BETTER_AUTH_42_SCHOOL_ID, BETTER_AUTH_42_SCHOOL_SECRET } from '$env/static/private';
import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public';

export const auth = betterAuth({
	session: {
		expiresIn: 60 * 60 * 24 * 7 // 7 days
	},
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
					scopes: ['public'],
					mapProfileToUser: async (profile) => {
						return {
							id: profile.id,
							createdAt: profile.created_at,
							updatedAt: profile.updated_at,
							email: profile.email,
							emailVerified: true,
							name: profile.usual_full_name,
							image: profile.image?.link
						};
					}
				}
			]
		}),
		sveltekitCookies(getRequestEvent)
	]
});
