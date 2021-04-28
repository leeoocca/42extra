import { SWRConfig } from "swr";
import "../styles/globals.css";
import { Provider } from "next-auth/client";
import fetcherWithToken from "@lib/fetcherWithToken";
import { getLayout as getSimpleLayout } from "@components/layouts/SimpleLayout";

function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || getSimpleLayout;

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
