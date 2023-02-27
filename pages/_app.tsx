import ProgressBar from "@badrap/bar-of-progress";
import { KBarProvider } from "kbar";
import { globalActions } from "lib/actions";
import fetcher from "lib/fetcher";
import theme from "lib/theme";
import { SessionProvider } from "next-auth/react";
import Router, { useRouter } from "next/router";
import "styles/globals.css";
import { SWRConfig, SWRConfiguration } from "swr";
import { ThemeProvider } from "theme-ui";
import Favicons from "ui/Favicons";
import Shell from "ui/Shell";

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
	fetcher,
	revalidateOnFocus: false,
	dedupingInterval: 30 * 1000, // 30 seconds
	shouldRetryOnError: false,
};

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}) {
	const { query } = useRouter();

	const getShell = (child) =>
		Component.shell === false ? (
			child
		) : (
			<Shell
				headerContent={Component.header && <Component.header />}
				intraLink={
					Component.getIntraLink && Component.getIntraLink(query)
				}
			>
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
