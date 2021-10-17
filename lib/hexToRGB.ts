function hexToRGB(hex: string) {
	if (hex[0] == "#") hex = hex.substr(1);
	const aRgbHex = hex.match(/.{1,2}/g);
	const aRgb = [
		parseInt(aRgbHex[0], 16),
		parseInt(aRgbHex[1], 16),
		parseInt(aRgbHex[2], 16),
	];
	return aRgb.join(", ");
}

export default hexToRGB;
