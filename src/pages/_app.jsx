import { SWRConfig } from "swr";
import "../styles/globals.css";
import { Provider } from "next-auth/client";
import fetcherWithToken from "@lib/fetcherWithToken";
import MainLayout from "@components/layouts/MainLayout";

function MyApp({ Component, pageProps }) {
	const getLayout =
		Component.getLayout || ((page) => <MainLayout children={page} />);

	return (
		<SWRConfig
			value={{
				fetcher: fetcherWithToken,
				onError: (err) => {
					console.error(err);
				},
			}}
		>
			<Provider session={pageProps.session}>
				{getLayout(<Component {...pageProps} />)}
			</Provider>
		</SWRConfig>
	);
}

export default MyApp;
