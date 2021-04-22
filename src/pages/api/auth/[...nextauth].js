import NextAuth from "next-auth";
import { signIn } from "next-auth/client";

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
			async profile(OAuthProfile, tokens) {
				// You can use the tokens, in case you want to fetch more profile information
				// For example several OAuth provider does not return e-mail by default.
				// Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
				return {
					id: OAuthProfile.id,
					login: OAuthProfile.login,
					name:
						OAuthProfile.usual_first_name ||
						OAuthProfile.first_name,
					email: OAuthProfile.email,
					image: OAuthProfile.image_url,
					token: tokens.accessToken,
				};
			},
			clientId: process.env.FT_UID,
			clientSecret: process.env.FT_SECRET,
		},
	],
	// pages: {
	// 	signIn: '/login',
	// },
	callbacks: {
		async jwt(token, user, account, profile, isNewUser) {
			// Add access_token to the token right after signin
			if (account?.accessToken) {
				token.accessToken = account.accessToken;
			}
			return token;
		},
		async session(_, token) {
			if (Date.now() > token.iat + 7200)
				fetch("http://localhost:3000/api/auth/signin/42", {
					method: "POST",
				});
			return token; // Pass the jwt to the session
		},
	},
});
