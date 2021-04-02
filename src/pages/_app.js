import Layout from '@components/Layout';
import { UserProvider } from '@context/user';
import { SWRConfig } from 'swr'
import fetch from '../lib/fetchJson'
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	return (
		<SWRConfig
			value={{
				fetcher: fetch,
				onError: (err) => {
					console.error(err)
				},
			}}
		>
			<UserProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</UserProvider>
		</SWRConfig>
	);
}

export default MyApp;
