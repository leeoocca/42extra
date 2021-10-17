import "styles/globals.css";
import { getLayout as getSimpleLayout } from "ui/layouts/SimpleLayout";
import { Provider } from "next-auth/client";
import { SWRConfig } from "swr";
import { ThemeProvider } from "theme-ui";
import fetcher from "lib/fetcher";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import theme from "lib/theme";

const progress = new ProgressBar({
	size: 2,
	color: "--theme-ui-colors-primary", // use css variable
	className: "bar-of-progress",
	delay: 0,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", () => {
	progress.finish();
	window.scrollTo(0, 0);
});
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || getSimpleLayout;

	return (
		<ThemeProvider theme={theme}>
			<Provider
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
					{getLayout(<Component {...pageProps} />)}
				</SWRConfig>
			</Provider>
		</ThemeProvider>
	);
}

export default MyApp;
