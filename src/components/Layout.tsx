import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

import StatusBar from "@components/StatusBar";
import Footer from "@components/Footer";
import NavLink from "@components/NavLink";

import { LinkListNode } from "@interfaces/LinkListNode";

function Layout({
	children,
	breadcrumbs,
	navLinks,
	header,
}: {
	children: React.ReactNode;
	breadcrumbs?: LinkListNode[];
	navLinks?: LinkListNode[];
	header?: React.ReactNode;
}) {
	const router = useRouter();
	const [session, loading] = useSession();

	if (loading)
		return (
			<div className="grid w-screen min-h-screen text-white bg-black place-items-center">
				<code>Loading...</code>
			</div>
		);

	if (!session) router.push("/api/auth/signin");

	return (
		<div className="flex flex-col min-h-screen font-sans antialiased text-white bg-black">
			<div className="bg-opacity-50 bg-skin-nav">
				<StatusBar breadcrumbs={breadcrumbs} />
				{header}
				{navLinks && (
					<nav className="max-w-7xl mx-auto px-4 py-2 -mb-0.5">
						{/* border-b border-gray-600 */}
						{navLinks.map((item) => (
							<NavLink
								isActive={item.isActive}
								key={item.uri}
								name={item.name}
								uri={item.uri}
							/>
						))}
					</nav>
				)}
				{/* <hr className="-mt-0.5 border-white border-opacity-25" /> */}
			</div>
			<main className="flex-grow min-w-full py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">{children}</div>
			</main>
			<Footer />
		</div>
	);
}

export default Layout;
