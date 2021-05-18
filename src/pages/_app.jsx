import "@/styles/globals.css";
import { getLayout as getSimpleLayout } from "@/components/layouts/SimpleLayout";
import { Provider } from "next-auth/client";
import { SWRConfig } from "swr";
import { ThemeProvider } from "next-themes";
import fetcherWithToken from "@/lib/fetcherWithToken";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";

const progress = new ProgressBar({
	size: 2,
	color: "#22D3EE", // use css variable
	className: "bar-of-progress",
	delay: 100,
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
		<ThemeProvider defaultTheme="system">
			<Provider session={pageProps.session}>
				<SWRConfig
					value={{
						fetcher: fetcherWithToken,
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
