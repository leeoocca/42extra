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

	if (!session?.user) {
		if (!loading) signIn();
		return <Loader />;
	}

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
			<div className="flex flex-col min-h-screen antialiased bg-background text-foreground">
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
