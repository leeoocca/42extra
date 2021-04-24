module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			textColor: {
				skin: {
					base: "var(--color-base)",
					text: "var(--color-text)",
				},
			},
			backgroundColor: {
				skin: {
					nav: "var(--color-nav-bg)",
					base: "var(--color-base)",
					text: "var(--color-text)",
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
