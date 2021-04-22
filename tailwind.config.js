module.exports = {
	purge: ["./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "media", // or 'media' or 'class'
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
