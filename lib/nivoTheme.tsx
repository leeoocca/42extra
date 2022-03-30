const nivoTheme = {
	background: "transparent",
	textColor: "var(--theme-ui-colors-text)",
	fontSize: 11,
	axis: {
		domain: {
			line: {
				stroke: "#777777",
				strokeWidth: 1,
			},
		},
		legend: {
			text: {
				fontSize: 12,
				fill: "var(--theme-ui-colors-text)",
			},
		},
		ticks: {
			line: {
				stroke: "#777777",
				strokeWidth: 1,
			},
			text: {
				fontSize: 11,
				fill: "var(--theme-ui-colors-text)",
			},
		},
	},
	grid: {
		line: {
			stroke: "#dddddd",
			strokeWidth: 1,
		},
	},
	legends: {
		title: {
			text: {
				fontSize: 11,
				fill: "var(--theme-ui-colors-text)",
			},
		},
		text: {
			fontSize: 11,
			fill: "var(--theme-ui-colors-text)",
		},
		ticks: {
			line: {},
			text: {
				fontSize: 10,
				fill: "var(--theme-ui-colors-text)",
			},
		},
	},
	annotations: {
		text: {
			fontSize: 13,
			fill: "var(--theme-ui-colors-text)",
			outlineWidth: 2,
			outlineColor: "var(--theme-ui-colors-background)",
			outlineOpacity: 1,
		},
		link: {
			stroke: "var(--theme-ui-colors-text)",
			strokeWidth: 1,
			outlineWidth: 2,
			outlineColor: "var(--theme-ui-colors-background)",
			outlineOpacity: 1,
		},
		outline: {
			stroke: "var(--theme-ui-colors-text)",
			strokeWidth: 2,
			outlineWidth: 2,
			outlineColor: "var(--theme-ui-colors-background)",
			outlineOpacity: 1,
		},
		symbol: {
			fill: "var(--theme-ui-colors-text)",
			outlineWidth: 2,
			outlineColor: "var(--theme-ui-colors-background)",
			outlineOpacity: 1,
		},
	},
	tooltip: {
		container: {
			background: "var(--theme-ui-colors-background)",
			color: "var(--theme-ui-colors-text)",
			fontSize: 12,
		},
		basic: {},
		chip: {},
		table: {},
		tableCell: {},
		tableCellValue: {},
	},
};

export default nivoTheme;
