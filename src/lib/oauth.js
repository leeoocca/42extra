const { AuthorizationCode } = require("simple-oauth2");

function createAuthClient(credentials) {
	if (!credentials.client.id || !credentials.client.secret) {
		throw new Error("Missing a valid 42 OAuth client ID and secret");
	}

	return new AuthorizationCode(credentials);
}

module.exports = createAuthClient({
	client: {
		id: process.env.FT_UID,
		secret: process.env.FT_SECRET,
	},
	auth: {
		tokenHost: "https://api.intra.42.fr",
		tokenPath: "https://api.intra.42.fr/oauth/token",
		authorizePath: "https://api.intra.42.fr/oauth/authorize",
	},
});
