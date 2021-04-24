import { getLayout } from "@components/layouts/MainLayout";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";

function Home() {
	const [session, loading] = useSession();

	return (
		<>
			<Head>
				<title>42next</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<p>Welcome {session.user?.name}!</p>
					<Link href="/users/lrocca">lrocca</Link>
				</>
			)}
		</>
	);
}

Home.getLayout = getLayout;

export default Home;
