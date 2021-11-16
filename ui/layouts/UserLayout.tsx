import Head from "next/head";
import { useRouter } from "next/router";

import { BaseAction, useRegisterActions } from "kbar";

import useAPI from "lib/useAPI";
import hexToRGB from "lib/hexToRGB";
import { getUserNavLinks } from "lib/NavLinks";
import NavLink from "ui/NavLink";
import UserHeader from "ui/headers/UserHeader";
import { getLayout as getMainLayout } from "./MainLayout";

function UserLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { login } = router.query;
	const navLinks = getUserNavLinks();

	const {
		data: coalition,
		isLoading,
		isError,
	} = useAPI(`/v2/users/${login}/coalitions`);

	document.documentElement.style.setProperty("--nav", "");

	if (!isLoading)
		if (coalition !== undefined && coalition[0] !== undefined)
			document.documentElement.style.setProperty(
				"--nav",
				hexToRGB(coalition[0].color)
			);
		else document.documentElement.style.setProperty("--nav", "0, 186, 188");

	const routeArray = router.route.split("/");
	const pageName = routeArray[routeArray.length - 1];
	let title = login;
	if (pageName !== "[login]") title = `${login}'s ${pageName}`;
	title += " – 42extra";

	const section = `${login}'s profile`;

	const actions: BaseAction[] = [
		{
			id: "userOverview",
			name: "Overview",
			shortcut: ["o"],
			section: section,
			perform: () => router.push(`/users/${login}`),
		},
		{
			id: "userProjects",
			name: "Projects",
			shortcut: ["p"],
			keywords: "cursus",
			section: section,
			perform: () => router.push(`/users/${login}/projects`),
		},
		{
			id: "userQuests",
			name: "Quests",
			shortcut: ["q"],
			keywords: "common core",
			section: section,
			perform: () => router.push(`/users/${login}/quests`),
		},
		{
			id: "userAchievements",
			name: "Achievements",
			shortcut: ["a"],
			keywords: "",
			section: section,
			perform: () => router.push(`/users/${login}/achievements`),
		},
		{
			id: "userLocations",
			name: "Locations",
			shortcut: ["l"],
			keywords: "cluster place",
			section: section,
			perform: () => router.push(`/users/${login}/locations`),
		},
		{
			id: "userScales",
			name: "Scales",
			keywords: "evaluations",
			section: section,
			perform: () => router.push(`/users/${login}/scales`),
		},
		{
			id: "userPatronages",
			name: "Patronages",
			keywords: "",
			section: section,
			perform: () => router.push(`/users/${login}/patronages`),
		},
		{
			id: "userPartnerships",
			name: "Partnerships",
			keywords: "company companies",
			section: section,
			perform: () => router.push(`/users/${login}/partnerships`),
		},
		{
			id: "userApps",
			name: "Apps",
			keywords: "",
			section: section,
			perform: () => router.push(`/users/${login}/apps`),
		},
	];

	useRegisterActions(actions);

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<div className="transition-colors duration-500 bg-nav">
				<div className="relative mx-auto overflow-hidden max-w-7xl">
					<UserHeader />
					{coalition &&
						coalition[0] !== undefined &&
						coalition[0].image_url && (
							<img
								src={coalition[0].image_url}
								alt={coalition[0].name}
								className="absolute object-cover w-20 text-transparent md:w-40 top-4 right-4 mix-blend-soft-light"
							/>
						)}
					<nav
						className={`px-4 space-x-4 flex mx-auto select-none overflow-auto`}
					>
						{navLinks.map((item) => (
							<NavLink
								key={item.href}
								name={item.name}
								href={item.href}
							/>
						))}
					</nav>
				</div>
			</div>
			<main className="flex-grow w-full px-4 py-6 mx-auto max-w-7xl">
				{children}
			</main>
		</>
	);
}

export const getLayout = (page: React.ReactNode) =>
	getMainLayout(<UserLayout>{page}</UserLayout>);

export default UserLayout;
