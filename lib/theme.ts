import { Theme } from "@theme-ui/css";
import { base } from "@theme-ui/presets";

const theme: Theme = {
	...base,
	colors: {
		text: "#fff",
		background: "#121212",
		primary: "#22D3EE", // #3cf
		secondary: "#e0f",
		muted: "#191919", // #333
		highlight: "#29112c",
		gray: "#999",
		lime: "#01FF70",
		red: "#FF4136",
	},
	fonts: {
		body: "Inter var, system-ui, sans-serif",
		heading: "inherit",
		monospace:
			"JetBrains Mono, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
	},
	layout: {
		container: {
			p: 3,
			maxWidth: "80rem",
		},
	},
	text: {
		kbd: {
			"& kbd:not(:last-child)": {
				mr: 1,
			},
			"& kbd": {
				py: 1,
				px: 2,
				borderRadius: 4,
				fontSize: "0.9rem",
				fontFamily: "sans-serif",
				background: "rgba(255 255 255 / .1)",
			},
		},
	},
	styles: {
		...base.styles,
	},
};

export default theme;
