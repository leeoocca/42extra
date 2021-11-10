import Head from "next/head";
import { useSession, signIn } from "next-auth/client";

import Footer from "ui/Footer";
import Loader from "ui/Loader";
import StatusBar from "ui/StatusBar";
import { Box } from "@theme-ui/components";

interface Props {
	children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
	const [session, loading] = useSession();

	var content = (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<StatusBar />
			<Box
				sx={{
					width: "100%",
					flex: "1 1 auto",
				}}
			>
				{children}
			</Box>
			<Footer />
		</Box>
	);

	if (!loading && !session?.user) signIn("42");

	return (
		<>
			<Head>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="manifest" href="/site.webmanifest" />

				<meta name="theme-color" content="#000000" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>
				<link
					rel="mask-icon"
					href="/safari-pinned-tab.svg"
					color="#01babc"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
			</Head>
			{loading ? <Loader /> : content}
		</>
	);
}

export const getLayout = (page: React.ReactNode) => (
	<MainLayout>{page}</MainLayout>
);
