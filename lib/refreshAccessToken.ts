async function refreshAccessToken(token) {
	try {
		const url =
			"https://api.intra.42.fr/oauth/token?" +
			new URLSearchParams({
				client_id: process.env.FT_UID,
				client_secret: process.env.FT_SECRET,
				grant_type: "refresh_token",
				refresh_token: token.refreshToken,
				redirect_uri: process.env.FT_REDIRECT,
			});

		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Bearer ${token.accessToken}`,
			},
			method: "POST",
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			expires: refreshedTokens.created_at + refreshedTokens.expires_in,
			refreshToken: refreshedTokens.refresh_token,
		};
	} catch (error) {
		console.error(error);

		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}

export default refreshAccessToken;
