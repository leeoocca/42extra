import UserHeader from "@components/headers/UserHeader";
import NavLink from "@components/NavLink";
import { User } from "@interfaces/User";
import useAPI from "@lib/useAPI";
import { getUserNavLinks } from "@utils/NavLinks";
import { useRouter } from "next/router";
import { getLayout as getMainLayout } from "./MainLayout";

function UserLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { login } = router.query;
	const navLinks = getUserNavLinks(String(login));

	const { data: coalition, isLoading, isError } = useAPI(
		`/v2/users/${login}/coalitions`
	);

	if (coalition !== undefined)
		document.documentElement.style.setProperty(
			"--color-nav-bg",
			coalition[0].color + "DD"
		);

	if (isLoading || isError) return <>Loading or error</>;

	return (
		<>
			<div className="bg-skin-nav">
				<UserHeader />
				{navLinks && (
					<nav className="px-4 py-2 mx-auto max-w-7xl">
						{/* border-b border-gray-600 */}
						{navLinks.map((item) => (
							<NavLink
								key={item.href}
								name={item.name}
								href={item.href}
							/>
						))}
					</nav>
				)}
			</div>
			<main className="flex-grow px-4 py-6 mx-auto max-w-7xl">
				{children}
			</main>
		</>
	);
}

export const getLayout = (page: React.ReactNode) =>
	getMainLayout(<UserLayout>{page}</UserLayout>);

export default UserLayout;
