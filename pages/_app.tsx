import "styles/globals.css";
import Router from "next/router";

import { KBarProvider } from "kbar";
import { SWRConfig } from "swr";
import { ThemeProvider } from "theme-ui";
import ProgressBar from "@badrap/bar-of-progress";
import { getSession, SessionProvider } from "next-auth/react";

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

const SWRSettings = {
	fetcher: fetcher,
	onError: (err) => {
		console.error(err);
	},
	revalidateOnFocus: false,
	dedupingInterval: 60 * 1000,
	shouldRetryOnError: false,
};

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const getLayout = Component.getLayout || getSimpleLayout;

	return (
		<SessionProvider session={session} refetchInterval={60 * 60}>
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

export async function getServerSideProps(context) {
	return {
		props: { session: await getSession(context) },
	};
}
