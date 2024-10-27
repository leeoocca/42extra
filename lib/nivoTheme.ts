import { Theme } from "@nivo/core";

const nivoTheme: Theme = {
	text: {
		fill: "var(--theme-ui-colors-text)",
	},
	tooltip: {
		container: {
			background: "var(--theme-ui-colors-background)",
			color: "var(--theme-ui-colors-text)",
			fontSize: 12,
		},
	},
	crosshair: {
		line: {
			stroke: "var(--theme-ui-colors-primary)",
			strokeWidth: 1,
			strokeOpacity: 1,
		},
	},
};

export default nivoTheme;
