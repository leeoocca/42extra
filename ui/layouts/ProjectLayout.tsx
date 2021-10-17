import ProjectUserHeader from "ui/headers/ProjectUserHeader";
import { useRouter } from "next/router";
import { getLayout as getMainLayout } from "./MainLayout";
import ProjectHeader from "ui/headers/ProjectHeader";

function ProjectLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { login } = router.query;
	// const navLinks = getProjectNavLinks();

	document.documentElement.style.setProperty("--nav", "");

	return (
		<>
			<div className="transition-colors duration-500 bg-nav">
				<div className="mx-auto max-w-7xl">
					{login ? (
						<ProjectUserHeader />
					) : (
						<>
							<ProjectHeader />
							{/* <nav
								className={`px-4 space-x-4 flex mx-auto select-none overflow-auto`}
							>
								{navLinks.map((item) => (
									<NavLink
										key={item.href}
										name={item.name}
										href={item.href}
									/>
								))}
							</nav> */}
						</>
					)}
				</div>
			</div>
			<main className="flex-grow w-full px-4 py-6 mx-auto max-w-7xl">
				{children}
			</main>
		</>
	);
}

export const getLayout = (page: React.ReactNode) =>
	getMainLayout(<ProjectLayout>{page}</ProjectLayout>);

export default ProjectLayout;
