import "styles/globals.css";
import Router from "next/router";

import { KBarProvider } from "kbar";
import { SessionProvider } from "next-auth/react";
import { SWRConfig, SWRConfiguration } from "swr";
import { ThemeProvider } from "theme-ui";
import ProgressBar from "@badrap/bar-of-progress";

import { globalActions } from "lib/actions";
import Favicons from "ui/Favicons";
import fetcher from "lib/fetcher";
import Shell from "ui/Shell";
import theme from "lib/theme";

const progress = new ProgressBar({
	size: 2,
	color: "var(--theme-ui-colors-primary)",
	className: "bar-of-progress",
	delay: 0,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

const SWRSettings: SWRConfiguration = {
	fetcher: fetcher,
	onError: (err) => {
		console.error(err);
	},
	revalidateOnFocus: false,
	dedupingInterval: 30 * 1000, // 30 seconds
	shouldRetryOnError: false,
};

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const getShell = (child) =>
		Component.shell === false ? (
			child
		) : (
			<Shell headerContent={Component.header && <Component.header />}>
				{child}
			</Shell>
		);

	return (
		<ThemeProvider theme={theme}>
			<SessionProvider session={session} refetchInterval={60 * 60}>
				<SWRConfig value={SWRSettings}>
					<KBarProvider actions={globalActions}>
						<Favicons />
						{getShell(<Component {...pageProps} />)}
					</KBarProvider>
				</SWRConfig>
			</SessionProvider>
		</ThemeProvider>
	);
}
