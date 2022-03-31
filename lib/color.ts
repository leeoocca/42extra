export function setPrimaryColor(color: string = "") {
	color = mendColor(color);
	document.documentElement.style.setProperty(
		"--theme-ui-colors-primary",
		color
	);
}

export function hexToRGB(hex: string) {
	if (hex[0] == "#") hex = hex.substring(1);
	const aRgbHex = hex.match(/.{1,2}/g);
	const aRgb = [
		parseInt(aRgbHex[0], 16),
		parseInt(aRgbHex[1], 16),
		parseInt(aRgbHex[2], 16),
	];
	return aRgb.join(", ");
}

export function mendColor(color: string) {
	if (color.length === 6) color = "#" + color;
	return color;
}
