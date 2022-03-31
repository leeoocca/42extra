import { useRouter } from "next/router";
import Link from "next/link";

import { Project, ProjectsUser, User } from "types/42";
import PageTitle from "ui/PageTitle";
import useAPI from "lib/useAPI";
import { useEffect } from "react";
import setPrimaryColor from "lib/setPrimaryColor";

export default function ProjectUserHeader() {
	const router = useRouter();
	const { login, project } = router.query;

	const { data: projectData } = useAPI<Project>(`/v2/projects/${project}`);
	const { data: user } = useAPI<User>(`/v2/users/${login}`);

	setPrimaryColor();

	let userProject: ProjectsUser | null = null;

	useEffect(
		function () {
			if (user) {
				userProject = user.projects_users.find(
					(projectsUsers) => projectsUsers.project.slug === project
				);
				if (!userProject) {
					setPrimaryColor();
				} else if (userProject["validated?"])
					setPrimaryColor("rgb(52, 211, 153)");
				else if (userProject.status === "in_progress")
					setPrimaryColor("rgb(251, 191, 36)");
				else setPrimaryColor("rgb(220, 38, 38)");
			}
		},
		[user]
	);

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
