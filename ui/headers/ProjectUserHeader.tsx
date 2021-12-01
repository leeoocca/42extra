import { useRouter } from "next/router";
import Link from "next/link";

import { ProjectsUser, User } from "types/User";
import PageTitle from "ui/PageTitle";
import useAPI from "lib/useAPI";

export default function ProjectUserHeader() {
	const router = useRouter();
	const { login, project } = router.query;

	const { data: projectData } = useAPI(`/v2/projects/${project}`);
	const { data: user }: { data: User } = useAPI(`/v2/users/${login}`);

	document.documentElement.style.setProperty("--nav", "");

	let userProject: ProjectsUser | null = null;

	if (user) {
		userProject = user.projects_users.find(
			(projectsUsers) => projectsUsers.project.slug === project
		);
		if (userProject["validated?"])
			document.documentElement.style.setProperty("--nav", "52, 211, 153");
		else if (userProject.status === "in_progress")
			document.documentElement.style.setProperty("--nav", "251, 191, 36");
		else document.documentElement.style.setProperty("--nav", "220, 38, 38");
	}

	return (
		<>
			<PageTitle>
				{`${login}'s ${projectData ? projectData.name : project}`}
			</PageTitle>
			<div className="relative px-4 py-10">
				<h1 className="text-2xl font-bold">
					<Link href={`/users/${login}`}>
						<a>{login}</a>
					</Link>
					's{" "}
					<Link href={`/projects/${project}`}>
						<a>{projectData ? projectData.name : project}</a>
					</Link>
				</h1>
				{userProject && (
					<span className="absolute opacity-75 top-2 text-8xl right-2">
						{userProject.final_mark}
					</span>
				)}
			</div>
		</>
	);
}
