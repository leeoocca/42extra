import "styles/globals.css";
import Router from "next/router";

import { KBarProvider } from "kbar";
import { SWRConfig, SWRConfiguration } from "swr";
import { ThemeProvider, Container } from "theme-ui";
import ProgressBar from "@badrap/bar-of-progress";
import { SessionProvider } from "next-auth/react";

import theme from "lib/theme";
import fetcher from "lib/fetcher";
import { globalActions } from "lib/actions";
import Shell from "ui/Shell";
import Favicons from "ui/Favicons";

const progress = new ProgressBar({
	size: 2,
	color: "var(--theme-ui-colors-primary)",
	className: "bar-of-progress",
	delay: 0,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", () => {
	progress.finish();
	window.scrollTo(0, 0);
});
Router.events.on("routeChangeError", progress.finish);

const SWRSettings: SWRConfiguration = {
	fetcher: fetcher,
	onError: (err) => {
		console.error(err);
	},
	revalidateOnFocus: false,
	dedupingInterval: 5000,
	shouldRetryOnError: false,
};

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const getShell = (child) =>
		Component.shell !== false ? <Shell>{child}</Shell> : child;
	const getLayout =
		Component.getLayout || ((child) => <Container>{child}</Container>);

	return (
		<SessionProvider session={session} refetchInterval={60 * 60}>
			<SWRConfig value={SWRSettings}>
				<ThemeProvider theme={theme}>
					<KBarProvider actions={globalActions}>
						<Favicons />
						{getShell(getLayout(<Component {...pageProps} />))}
					</KBarProvider>
				</ThemeProvider>
			</SWRConfig>
		</SessionProvider>
	);
}
