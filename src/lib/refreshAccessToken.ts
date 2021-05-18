async function refreshAccessToken(token) {
	try {
		const url = "https://api.intra.42.fr/oauth/token";

		const response = await fetch(url, {
			body: new URLSearchParams({
				client_id: process.env.FT_UID,
				client_secret: process.env.FT_SECRET,
				grant_type: "refresh_token",
				refresh_token: token.refreshToken,
				redirect_uri:
					process.env.NODE_ENV === "production"
						? process.env.FT_REDIRECT
						: "http://localhost:3000/api/auth/callback/42",
			}),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
		});
		const tokens = await response.json();

		if (!response.ok) {
			throw tokens;
		}

		return {
			...token,
			accessToken: tokens.access_token,
			expires: (Number(token.created_at) + 7200) * 1000,
			refreshToken: tokens.refresh_token,
		};
	} catch (error) {
		console.error(error);
		return {
			// ...token,
			error: "RefreshAccessTokenError",
		};
	}
}

export default refreshAccessToken;
