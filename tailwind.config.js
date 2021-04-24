module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backgroundColor: {
				skin: {
					nav: "var(--color-nav-bg)",
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
