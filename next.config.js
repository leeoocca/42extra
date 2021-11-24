module.exports = {
	images: {
		domains: ["cdn.intra.42.fr"],
	},
	async rewrites() {
			return [
				{
					source: '/api/v2/:path*',
					destination: `https://api.intra.42.fr/v2/:path*`,
				},
			]
	},
};
