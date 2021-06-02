import useAPI from "@/lib/useAPI";
import { ProjectsUser, User } from "@/types/User";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

function ProjectUserHeader() {
	const router = useRouter();
	const { login, slug } = router.query;

	const { data: project } = useAPI(`/v2/projects/${slug}`);
	const { data: user }: { data: User } = useAPI(`/v2/users/${login}`);

	document.documentElement.style.setProperty("--nav", "");

	let userProject: ProjectsUser | null = null;

	if (user) {
		userProject = user.projects_users.find(
			(project) => project.project.slug === slug
		);
		if (userProject["validated?"])
			document.documentElement.style.setProperty("--nav", "52, 211, 153");
		else if (userProject.status === "in_progress")
			document.documentElement.style.setProperty("--nav", "251, 191, 36");
		else document.documentElement.style.setProperty("--nav", "220, 38, 38");
	}

	return (
		<>
			<Head>
				<title>
					{login}'s {project ? project.name : slug} – 42next
				</title>
			</Head>
			<header className="relative px-4 py-10">
				<h1 className="text-2xl font-bold">
					<Link href={`/u/${login}`}>
						<a>{login}</a>
					</Link>
					's{" "}
					<Link href={`/p/${slug}`}>
						<a>{project ? project.name : slug}</a>
					</Link>
				</h1>
				{userProject && (
					<span className="absolute opacity-75 top-2 text-8xl right-2">
						{userProject.final_mark}
					</span>
				)}
			</header>
		</>
	);
}

export default ProjectUserHeader;
