import NextAuth from "next-auth";

import { User } from "types/User";
import refreshAccessToken from "lib/refreshAccessToken";

export default NextAuth({
	providers: [
		{
			id: "42",
			name: "42",
			type: "oauth",
			version: "2.0",
			clientId: process.env.FT_UID,
			clientSecret: process.env.FT_SECRET,
			authorization: {
				url: "https://api.intra.42.fr/oauth/authorize?response_type=code",
				params: {
					grant_type: "authorization_code",
					scope: "public projects",
				},
			},
			token: "https://api.intra.42.fr/oauth/token",
			userinfo: "https://api.intra.42.fr/v2/me",
			profile(profile: User) {
				const primaryUser = profile.campus_users.find(
					(campus) => campus.is_primary
				);
				return {
					id: String(profile.id),
					login: profile.login,
					name: profile.usual_first_name || profile.first_name,
					fullName: profile.usual_full_name,
					email: profile.email,
					image: profile.image_url,
					campus: primaryUser?.campus_id,
				};
			},
		},
	],
	theme: {
		colorScheme: "dark",
	},
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async jwt({ token, user, account }) {
			// initial sign in
			if (account) {
				return {
					accessToken: account.access_token,
					expires: account.expires_at,
					refreshToken: account.refresh_token,
					user,
				};
			}

			// access token has not expired yet
			if (Date.now() / 1000 < token.expires) return token;

			// access token has expired, try to update it
			return refreshAccessToken(token);
		},
		async session({ session, token }) {
			session.user = token.user;
			session.accessToken = token.accessToken;
			session.error = token.error;
			session.tokenExpires = token.expires;

			return session;
		},
	},
	secret: process.env.JWT_SECRET,
});
