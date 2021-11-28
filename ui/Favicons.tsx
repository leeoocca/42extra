import Head from "next/head";

import { useThemeUI } from "theme-ui";

export default function Favicons() {
	const { theme } = useThemeUI();
	return (
		<Head>
			<title>42extra</title>

			<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			<link rel="manifest" href="/site.webmanifest" />

			<meta
				name="theme-color"
				content={theme.colors.background.toString()}
			/>
			<meta
				name="apple-mobile-web-app-status-bar-style"
				content="black-translucent"
			/>
			<link
				rel="mask-icon"
				href="/safari-pinned-tab.svg"
				color="#01babc"
			/>
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicon-16x16.png"
			/>
		</Head>
	);
}
