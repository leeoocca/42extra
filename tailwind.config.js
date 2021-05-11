const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
			},
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
	plugins: [require("@tailwindcss/forms")],
};
