import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/client";

import StatusBar from "@/components/StatusBar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Head from "next/head";

function MainLayout({ children }: { children: React.ReactNode }) {
	const [session, loading] = useSession();
	const [loader, setLoader] = useState(true);

	useEffect(() => {
		setTimeout(() => setLoader(false), 1000);
	}, []);

	if (loader || loading || !session) {
		if (!loading && !session) signIn();
		return <Loader />;
	}

	// #1F2937
	document.documentElement.style.setProperty("--color-nav-bg", "#1E3A8ADD");

	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex flex-col min-h-screen font-sans antialiased bg-skin-base text-skin-text">
				<div
					className="bg-skin-nav"
					// style={{ transition: "background-color 200ms ease-in-out" }}
				>
					<StatusBar />
				</div>
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
