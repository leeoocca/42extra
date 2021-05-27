const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				nav: "rgba(var(--nav), var(--nav-opacity))",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
};
