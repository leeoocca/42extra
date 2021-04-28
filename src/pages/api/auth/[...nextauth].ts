import { User } from "@interfaces/User";
import NextAuth from "next-auth";
import refreshAccessToken from "@lib/refreshAccessToken";

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		{
			id: "42",
			name: "42",
			type: "oauth",
			version: "2.0",
			params: { grant_type: "authorization_code" },
			accessTokenUrl: "https://api.intra.42.fr/oauth/token",
			authorizationUrl:
				"https://api.intra.42.fr/oauth/authorize?response_type=code",
			profileUrl: "https://api.intra.42.fr/v2/me",
			async profile(OAuthProfile: User, tokens) {
				// You can use the tokens, in case you want to fetch more profile information
				// For example several OAuth provider does not return e-mail by default.
				// Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
				return {
					id: OAuthProfile.id,
					login: OAuthProfile.login,
					name:
						OAuthProfile.usual_first_name ||
						OAuthProfile.first_name,
					fullName: OAuthProfile.usual_full_name,
					email: OAuthProfile.email,
					image: OAuthProfile.image_url,
					campus: OAuthProfile.campus_users[0].campus_id,
					token: tokens.accessToken,
					sessionExpiry: tokens.created_at + 7200,
				};
			},
			clientId: process.env.FT_UID,
			clientSecret: process.env.FT_SECRET,
		},
	],
	// session: {
	// 	maxAge: 7200,
	// },
	// pages: {
	// 	signIn: '/login',
	// },
	callbacks: {
		async jwt(prevToken, user, account, profile, isNewUser) {
			// Signing in
			if (account && profile) {
				return {
					accessToken: account.access_token,
					accessTokenExpires: (account.created_at + 7200) * 1000,
					refreshToken: account.refresh_token,
					user: user,
				};
			}

			// Subsequent use of JWT, the user has been logged in before
			// access token has not expired yet
			if (Date.now() < prevToken.accessTokenExpires) return prevToken;

			// access token has expired, try to update it
			return refreshAccessToken(prevToken);
		},
		async session(session, token) {
			if (token) {
				session.user = token.user;
				session.accessToken = token.accessToken;
			}
			return session;
		},
	},
});
