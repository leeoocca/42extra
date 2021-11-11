import "styles/globals.css";
import { CSSProperties } from "react";
import Router from "next/router";

import {
	Action,
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarResults,
	KBarSearch,
} from "kbar";
import { SWRConfig } from "swr";
import { ThemeProvider } from "theme-ui";
import ProgressBar from "@badrap/bar-of-progress";
import { Provider as SessionProvider } from "next-auth/client";

import theme from "lib/theme";
import fetcher from "lib/fetcher";
import { getLayout as getSimpleLayout } from "ui/layouts/SimpleLayout";

const progress = new ProgressBar({
	size: 2,
	color: "--theme-ui-colors-primary",
	className: "bar-of-progress",
	delay: 0,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", () => {
	progress.finish();
	window.scrollTo(0, 0);
});
Router.events.on("routeChangeError", progress.finish);

const searchStyle: CSSProperties = {
	padding: "12px 16px",
	fontSize: "16px",
	width: "100%",
	boxSizing: "border-box",
	outline: "none",
	border: "none",
	background: "var(--theme-ui-colors-background)",
	color: "var(--theme-ui-colors-text)",
};

const resultsStyle: CSSProperties = {
	maxHeight: 400,
	overflow: "auto",
	background: "var(--theme-ui-colors-background)",
	color: "var(--theme-ui-colors-text)",
};

const animatorStyle: CSSProperties = {
	maxWidth: "500px",
	width: "100%",
	background: "var(--theme-ui-colors-background)",
	color: "var(--theme-ui-colors-text)",
	borderRadius: "8px",
	overflow: "hidden",
	boxShadow: "var(--shadow)",
};

export default function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || getSimpleLayout;

	const actions: Action[] = [
		{
			id: "home",
			name: "Home",
			shortcut: ["h"],
			keywords: "",
			perform: () => Router.push("/"),
		},
		{
			id: "users",
			name: "Users",
			shortcut: ["u"],
			keywords: "login",
			perform: () => Router.push("/users"),
		},
		{
			id: "campus",
			name: "Campuses",
			shortcut: [],
			keywords: "",
			perform: () => Router.push("/campus"),
		},
		{
			id: "coalitions",
			name: "Coalitions",
			shortcut: [],
			keywords: "",
			perform: () => Router.push("/coalitions"),
		},
		{
			id: "cursus",
			name: "Cursuses",
			shortcut: [],
			keywords: "",
			perform: () => Router.push("/cursus"),
		},
		{
			id: "apps",
			name: "Apps",
			shortcut: [],
			keywords: "",
			perform: () => Router.push("/apps"),
		},
	];

	return (
		<SessionProvider
			session={pageProps.session}
			options={{
				clientMaxAge: 60 * 60,
			}}
		>
			<SWRConfig
				value={{
					fetcher: fetcher,
					onError: (err) => {
						console.error(err);
					},
					revalidateOnFocus: false,
					dedupingInterval: 60 * 1000,
					errorRetryInterval: 2000,
				}}
			>
				<ThemeProvider theme={theme}>
					<KBarProvider actions={actions}>
						<KBarPortal>
							<KBarPositioner>
								<KBarAnimator style={animatorStyle}>
									<KBarSearch style={searchStyle} />
									<KBarResults style={resultsStyle} />
								</KBarAnimator>
							</KBarPositioner>
						</KBarPortal>
						{getLayout(<Component {...pageProps} />)}
					</KBarProvider>
				</ThemeProvider>
			</SWRConfig>
		</SessionProvider>
	);
}
