import { apiBaseUrl } from "lib/constants";
import refreshAccessToken from "lib/refreshAccessToken";
import NextAuth from "next-auth";
import { User } from "types/42";

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
				url: `${apiBaseUrl}/oauth/authorize?response_type=code`,
				params: {
					grant_type: "authorization_code",
					scope: "public projects profile",
				},
			},
			token: `${apiBaseUrl}/oauth/token`,
			userinfo: `${apiBaseUrl}/v2/me`,
			profile(profile: User) {
				const primaryCampus = profile.campus_users.find(
					(campus) => campus.is_primary
				);
				return {
					id: String(profile.id),
					login: profile.login,
					name: profile.usual_first_name || profile.first_name,
					fullName: profile.usual_full_name,
					email: profile.email,
					image: profile.image.link,
					campus: primaryCampus?.campus_id,
					staff: profile["staff?"],
					cursus: profile.cursus_users.map((c) => c.cursus_id),
				};
			},
		},
	],
	secret: process.env.JWT_SECRET,
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
			session.tokenExpires = token.expires;

			return session;
		},
	},
});
