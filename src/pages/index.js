import { useUserState } from "@context/user";
import Head from "next/head";

export default function Home() {
	const { user, token, status, redirectToOAuth } = useUserState();

	return (<>
		<Head>
			<title>Create Next App</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
		{!token ? (
			<button
				className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
				onClick={() => redirectToOAuth()}
			>
				Login
			</button>
		) : status === "loading" ? (
			<p>Loading...</p>
		) : (
			<p>Welcome {user.login}!</p>
		)}</>
	);
}
