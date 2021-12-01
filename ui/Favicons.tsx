import Head from "next/head";

export default function Favicons() {
	return (
		<Head>
			<title>42extra</title>
			<link rel="icon" type="image/svg+xml" href="/icon.svg" />
			<link
				rel="icon"
				type="image/png"
				href="/icon_x192.png"
				sizes="any"
			/>
			<link rel="apple-touch-icon" href="/icon_x192.png" />
			<link rel="mask-icon" href="/icon.svg" color="#121212" />
			<meta name="theme-color" content="#121212" />
			<link rel="manifest" href="/site.webmanifest" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta
				name="apple-mobile-web-app-status-bar-style"
				content="black"
			/>
		</Head>
	);
}
