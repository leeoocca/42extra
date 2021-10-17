/** @jsxImportSource theme-ui */

import Head from "next/head";
import { useSession, signIn } from "next-auth/client";

import Footer from "components/Footer";
import Loader from "components/Loader";
import StatusBar from "components/StatusBar";

interface Props {
	children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
	const [session, loading] = useSession();

	var content = (
		<div
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<StatusBar />
			<main
				sx={{
					width: "100%",
					flex: "1 1 auto",
				}}
			>
				{children}
			</main>
			<Footer />
		</div>
	);

	if (!loading && !session?.user) signIn("42");

	return (
		<>
			<Head>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			</Head>
			{loading ? <Loader /> : content}
		</>
	);
}

export const getLayout = (page: React.ReactNode) => (
	<MainLayout>{page}</MainLayout>
);
