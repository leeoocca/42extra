module.exports = {
	images: {
		domains: ["cdn.intra.42.fr"],
	},
	async redirects() {
		return [
			{
				source: "/u",
				destination: "/users",
				permanent: true,
			},
		];
	},
};
