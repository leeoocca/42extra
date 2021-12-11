export default function setPrimaryColor(color: string = "") {
	document.documentElement.style.setProperty(
		"--theme-ui-colors-primary",
		color
	);
}
