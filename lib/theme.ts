import { Theme } from "@theme-ui/css";

const theme: Theme = {
	colors: {
		text: "#fff",
		background: "#060606", // #000
		primary: "#22D3EE", // #3cf
		secondary: "#e0f",
		muted: "#191919", // #333
		highlight: "#29112c",
		gray: "#999",
		purple: "#c0f",
	},
	fonts: {
		body: "'Inter var', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
		heading: "inherit",
		monospace: "'JetBrains Mono', ui-monospace, Menlo, Monaco, monospace",
	},
	fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
	fontWeights: {
		body: 400,
		heading: 700,
		display: 900,
	},
	lineHeights: {
		body: 1.5,
		heading: 1.25,
	},
	text: {
		// fontFamily: "heading",
		// fontWeight: "heading",
		// lineHeight: "heading",
		display: {
			variant: "text.heading",
			fontSize: [5, 6],
			fontWeight: "display",
			letterSpacing: "-0.03em",
			mt: 3,
		},
	},
	styles: {
		Container: {
			p: 3,
			maxWidth: 1024,
		},
		root: {
			fontFamily: "body",
			lineHeight: "body",
			fontWeight: "body",
		},
		h1: {
			variant: "text.display",
		},
		h2: {
			variant: "text.heading",
			fontSize: 5,
		},
		h3: {
			variant: "text.heading",
			fontSize: 4,
		},
		h4: {
			variant: "text.heading",
			fontSize: 3,
		},
		h5: {
			variant: "text.heading",
			fontSize: 2,
		},
		h6: {
			variant: "text.heading",
			fontSize: 1,
		},
		a: {
			color: "primary",
			"&:hover": {
				color: "secondary",
			},
		},
		pre: {
			variant: "prism",
			fontFamily: "monospace",
			fontSize: 1,
			p: 3,
			color: "text",
			bg: "muted",
			overflow: "auto",
			code: {
				color: "inherit",
			},
		},
		code: {
			fontFamily: "monospace",
			color: "secondary",
			fontSize: 1,
		},
		inlineCode: {
			fontFamily: "monospace",
			color: "secondary",
			bg: "muted",
		},
		table: {
			width: "100%",
			my: 4,
			borderCollapse: "separate",
			borderSpacing: 0,
			"th,td": {
				textAlign: "left",
				py: "4px",
				pr: "4px",
				pl: 0,
				borderColor: "muted",
				borderBottomStyle: "solid",
			},
		},
		th: {
			verticalAlign: "bottom",
			borderBottomWidth: "2px",
		},
		td: {
			verticalAlign: "top",
			borderBottomWidth: "1px",
		},
		hr: {
			border: 0,
			borderBottom: "1px solid",
			borderColor: "muted",
		},
		img: {
			maxWidth: "100%",
		},
	},
};

export default theme;
