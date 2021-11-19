import "styles/globals.css";
import Router from "next/router";

import { KBarProvider } from "kbar";
import { SWRConfig } from "swr";
import { ThemeProvider } from "theme-ui";
import ProgressBar from "@badrap/bar-of-progress";
import { Provider as SessionProvider } from "next-auth/client";

import theme from "lib/theme";
import fetcher from "lib/fetcher";
import { globalActions } from "lib/actions";
import CommandBar from "ui/CommandBar";
import { getLayout as getSimpleLayout } from "ui/layouts/SimpleLayout";

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

const sessionOptions = {
	clientMaxAge: 60 * 60,
};

const SWRSettings = {
	fetcher: fetcher,
	onError: (err) => {
		console.error(err);
	},
	revalidateOnFocus: false,
	dedupingInterval: 60 * 1000,
	errorRetryInterval: 2000,
};

export default function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || getSimpleLayout;

	return (
		<SessionProvider session={pageProps.session} options={sessionOptions}>
			<SWRConfig value={SWRSettings}>
				<ThemeProvider theme={theme}>
					<KBarProvider actions={globalActions}>
						<CommandBar />
						{getLayout(<Component {...pageProps} />)}
					</KBarProvider>
				</ThemeProvider>
			</SWRConfig>
		</SessionProvider>
	);
}
