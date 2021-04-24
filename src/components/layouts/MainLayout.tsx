import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

import StatusBar from "@components/StatusBar";
import Footer from "@components/Footer";
import NavLink from "@components/NavLink";

import { LinkListNode } from "@interfaces/LinkListNode";
import Loader from "@components/Loader";

function MainLayout({
	children,
	breadcrumbs,
	navLinks,
	header,
	navColor,
}: {
	children: React.ReactNode;
	breadcrumbs?: LinkListNode[];
	navLinks?: LinkListNode[];
	header?: React.ReactNode;
	navColor?: string;
}) {
	const router = useRouter();
	const [session, loading] = useSession();
	const [loader, setLoader] = useState(true);

	useEffect(() => {
		setTimeout(() => setLoader(false), 2500);
	}, []);

	if (loading || loader) return <Loader />;

	if (!session) router.push("/api/auth/signin");

	document.documentElement.style.setProperty("--color-nav-bg", "#333333DD");

	return (
		<div className="flex flex-col min-h-screen font-sans antialiased bg-skin-base text-skin-text">
			<div
				className="bg-skin-nav"
				// style={{ transition: "background-color 200ms ease-in-out" }}
			>
				<StatusBar />
			</div>
			{children}
			{/* <main className="flex-grow min-w-full py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0"></div>
			</main> */}
			<Footer />
		</div>
	);
}

export const getLayout = (page: React.ReactNode) => (
	<MainLayout>{page}</MainLayout>
);

export default MainLayout;
