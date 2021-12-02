import Head from "next/head";

const isDev = process.env.NODE_ENV === "development";

const devFavicon = () => (
	<link
		rel="icon"
		href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02MC42NTc1IDE0LjQxNjJDNTguMTM4NCAxNC40MTYyIDU1LjM5MDIgMTUuNDQ2OCA1Mi40MTMxIDE3LjUwNzlDNDkuNTUwNCAxOS41NjkgNDYuODAyMyAyMi4zNzQ0IDQ0LjE2ODYgMjUuOTI0MUM0MS41MzUgMjkuNDczOCAzOS4zMDIxIDMzLjU5NjEgMzcuNDcgMzguMjkwOEMzNS42Mzc5IDQyLjk4NTYgMzQuNTUwMSA0Ny45MDk0IDM0LjIwNjUgNTMuMDYyMkM0Mi45MDkgNTAuMzE0IDQ5LjcyMjIgNDcuMjc5NiA1NC42NDYgNDMuOTU4OUM1OS42ODQyIDQwLjYzODIgNjMuMjkxMiAzNy4yMDMgNjUuNDY2OCAzMy42NTMzQzY3LjY0MjQgMzAuMTAzNiA2OC43MzAzIDI2Ljc4MjkgNjguNzMwMyAyMy42OTEzQzY4LjczMDMgMjAuNzE0MSA2Ny45Mjg3IDE4LjQyNCA2Ni4zMjU2IDE2LjgyMDlDNjQuODM3IDE1LjIxNzggNjIuOTQ3NyAxNC40MTYyIDYwLjY1NzUgMTQuNDE2MlpNNDMuOTk2OCA5My4wODIyQzM1Ljc1MjQgOTMuMDgyMiAyOC45OTY1IDkwLjMzNDEgMjMuNzI5MiA4NC44Mzc3QzE4LjU3NjQgNzkuMzQxNCAxNiA3MS4zODMyIDE2IDYwLjk2MzFDMTYgNTMuNzQ5MiAxNy4yMDIzIDQ2Ljg3ODggMTkuNjA3IDQwLjM1MkMyMi4xMjYxIDMzLjcxMDYgMjUuNTYxMyAyNy44MTM1IDI5LjkxMjUgMjIuNjYwN0MzNC4zNzgzIDE3LjUwNzkgMzkuNDczOCAxMy40NDI5IDQ1LjE5OTIgMTAuNDY1OEM1MS4wMzkgNy40ODg1OSA1Ny4yNzk2IDYgNjMuOTIxIDZDNzAuNDQ3OSA2IDc1LjQ4NjEgNy41NDU4NCA3OS4wMzU4IDEwLjYzNzVDODIuNTg1NSAxMy42MTQ3IDg0LjM2MDQgMTcuNzk0MiA4NC4zNjA0IDIzLjE3NkM4NC4zNjA0IDI3LjQxMjcgODIuNzAwMSAzMS43NjQgNzkuMzc5NCAzNi4yMjk3Qzc2LjA1ODcgNDAuNjk1NSA3MC43MzQxIDQ0Ljk4OTUgNjMuNDA1NyA0OS4xMTE3QzU2LjA3NzMgNTMuMTE5NCA0Ni4zNDQyIDU2Ljc4MzYgMzQuMjA2NSA2MC4xMDQzQzM0Ljc3OTEgNjYuNDAyMiAzNi41NTM5IDcxLjAzOTcgMzkuNTMxMSA3NC4wMTY5QzQyLjUwODMgNzYuODc5NSA0Ni40NTg3IDc4LjMxMDkgNTEuMzgyNSA3OC4zMTA5QzU2LjY0OTggNzguMzEwOSA2MS4yMzAxIDc3LjA1MTMgNjUuMTIzMyA3NC41MzIyQzY5LjAxNjUgNzEuODk4NSA3Mi4yMjI3IDY4Ljk3ODYgNzQuNzQxOCA2NS43NzI0TDc5LjAzNTggNjkuMDM1OEM3Ni43NDU3IDczLjE1ODEgNzMuODI1OCA3Ny4wNTEzIDcwLjI3NjEgODAuNzE1NUM2Ni44NDA5IDg0LjM3OTcgNjIuODkwNCA4Ny4zNTY5IDU4LjQyNDcgODkuNjQ3QzU0LjA3MzQgOTEuOTM3MSA0OS4yNjQxIDkzLjA4MjIgNDMuOTk2OCA5My4wODIyWiIgZmlsbD0iIzMzRTNFNSIvPgo8L3N2Zz4K"
	/>
);

export default function Favicons() {
	return (
		<Head>
			<title>42extra</title>
			{isDev ? (
				devFavicon()
			) : (
				<>
					<link rel="icon" type="image/svg+xml" href="/icon.svg" />
					<link
						rel="icon"
						type="image/png"
						href="/icon_x192.png"
						sizes="any"
					/>
					<link rel="apple-touch-icon" href="/icon_x192.png" />
				</>
			)}
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
