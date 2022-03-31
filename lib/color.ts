export function setPrimaryColor(color: string = "") {
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
