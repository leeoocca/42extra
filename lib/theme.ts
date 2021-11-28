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
	},
	fonts: {
		body: "'Inter var', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
		heading: "inherit",
		monospace: "'JetBrains Mono', ui-monospace, Menlo, Monaco, monospace",
	},
	layout: {
		container: {
			p: 3,
			maxWidth: "80rem",
		},
	},
	styles: {
		...base.styles,
	},
};

export default theme;
