import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/client";

import StatusBar from "@/components/StatusBar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Head from "next/head";

interface Props {
	children: React.ReactNode;
}

function MainLayout({ children }: Props) {
	const [session, loading] = useSession();
	const [loader, setLoader] = useState(true);

	useEffect(() => {
		setTimeout(() => setLoader(false), 1000);
	}, []);

	if (loader || loading || !session?.user) {
		if (!loading && !session?.user) signIn();
		return <Loader />;
	}

	// #1F2937
	// document.documentElement.style.setProperty("--color-nav-bg", "#1E3A8ADD");

	return (
		<>
			<Head>
				<link
					rel="icon"
					href={
						// window.matchMedia("(prefers-color-scheme: light)")
						// 	.matches
						// 	? "/light-favicon.ico"
						// 	:
						"/favicon.ico"
					}
				/>
			</Head>
			<div className="flex flex-col min-h-screen antialiased bg-skin-base text-skin-text">
				<StatusBar />
				{children}
				<Footer />
			</div>
		</>
	);
}

export const getLayout = (page: React.ReactNode) => (
	<MainLayout>{page}</MainLayout>
);

export default MainLayout;
