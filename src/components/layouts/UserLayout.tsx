import UserHeader from "@/components/headers/UserHeader";
import NavLink from "@/components/NavLink";
import useAPI from "@/lib/useAPI";
import { getUserNavLinks } from "@/utils/NavLinks";
import Head from "next/head";
import { useRouter } from "next/router";
import { getLayout as getMainLayout } from "./MainLayout";

function UserLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { login } = router.query;
	const navLinks = getUserNavLinks(String(login));

	const { data: coalition, isLoading, isError } = useAPI(
		`/v2/users/${login}/coalitions`
	);

	/* if (isLoading) {
	} else  */
	if (coalition !== undefined && coalition[0] !== undefined)
		document.documentElement.style.setProperty(
			"--color-nav-bg",
			coalition[0].color + "DD"
		);
	else
		document.documentElement.style.setProperty(
			"--color-nav-bg",
			"#00BABCDD"
		);

	return (
		<>
			<Head>
				<title>{login} — 42next</title>
			</Head>
			<div
				className="bg-right bg-no-repeat bg-skin-nav bg-blend-soft-light"
				style={{
					backgroundImage: `url(
						${(coalition && coalition[0] !== undefined && coalition[0].image_url) || ""})`,
					backgroundPosition: "90%",
					backgroundSize: "10rem",
				}}
			>
				<UserHeader />
				<nav
					className={`px-4 py-2 mx-auto max-w-7xl select-none overflow-auto ${
						isError && "cursor-not-allowed"
					}`}
				>
					{navLinks.map((item) => (
						<NavLink
							key={item.href}
							name={item.name}
							href={item.href}
							className={isError && "pointer-events-none"}
						/>
					))}
				</nav>
			</div>
			<main className="flex-grow w-full px-4 py-6 mx-auto max-w-7xl">
				{!isLoading && !isError && children}
				{isError && (
					<>
						<img src="https://i.imgur.com/RDBy5.gif" />
						<p>Huston, do you copy?</p>
					</>
				)}
			</main>
		</>
	);
}

export const getLayout = (page: React.ReactNode) =>
	getMainLayout(<UserLayout>{page}</UserLayout>);

export default UserLayout;
