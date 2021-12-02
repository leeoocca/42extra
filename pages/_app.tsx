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

// import { useEffect, useState } from "react";
// import Loader from "ui/Loader";

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

// function Splash({ children }) {
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => setLoading(false), []);
// 	if (loading) return <Loader />;
// 	return children;
// }

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
			{/* <Splash> */}
			<SessionProvider session={session} refetchInterval={60 * 60}>
				<SWRConfig value={SWRSettings}>
					<KBarProvider actions={globalActions}>
						<Favicons />
						{getShell(<Component {...pageProps} />)}
					</KBarProvider>
				</SWRConfig>
			</SessionProvider>
			{/* </Splash> */}
		</ThemeProvider>
	);
}
