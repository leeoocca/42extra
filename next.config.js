module.exports = {
	async rewrites() {
		return [
			{
				source: "/api/v2/:path*",
				destination: `https://api.intra.42.fr/v2/:path*`,
			},
		];
	},
	reactStrictMode: true,
};
