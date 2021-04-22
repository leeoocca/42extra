import Layout from '@components/Layout';
import { SWRConfig } from 'swr'
import "../styles/globals.css";
import { Provider } from 'next-auth/client'

const fetcherWithToken = async (url, token) => {
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	if (!res.ok) {
		const error = new Error('An error occurred while fetching the data.')
		// Attach extra info to the error object.
		error.info = await res.json()
		error.status = res.status
		throw error
	}

	return res.json()
}

function MyApp({ Component, pageProps }) {
	return (
		<SWRConfig
			value={{
				fetcher: fetcherWithToken,
				onError: (err) => {
					console.error(err)
				},
			}}
		>
			<Provider session={pageProps.session}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</Provider>
		</SWRConfig>
	);
}

export default MyApp;
