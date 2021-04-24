import Layout from "@components/Layout";
import { useSession, signIn } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
	const [session, loading] = useSession();

	return (
		<Layout>
			<Head>
				<title>42next</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{!session ? (
				<button
					className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
					onClick={() => signIn("42")}
				>
					Login
				</button>
			) : loading ? (
				<p>Loading...</p>
			) : (
				<p>Welcome {session.user?.name}!</p>
			)}
			<Link href="/users/lrocca">lrocca</Link>
		</Layout>
	);
}
