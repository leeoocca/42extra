import { setPrimaryColor } from "lib/color";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Project, ProjectsUser, User } from "types/42";
import Link from "ui/Link";
import PageTitle from "ui/PageTitle";

export default function ProjectUserHeader() {
	const {
		query: { login, project },
	} = useRouter();

	const { data: projectData } = useAPI<Project>(`/v2/projects/${project}`);
	const { data: user } = useAPI<User>(`/v2/users/${login}`);

	let userProject: ProjectsUser | null = null;

	useEffect(() => {
		if (!user) return;
		userProject = user.projects_users.find(
			(projectsUsers) => projectsUsers.project.slug === project
		);
		const color =
			(!userProject && null) ||
			(userProject.status !== "finished" && "rgb(251, 191, 36)") ||
			(!userProject["validated?"] && "rgb(220, 38, 38)") ||
			"rgb(52, 211, 153)";
		setPrimaryColor(color);
	}, [user]);

	useEffect(() => {
		return () => setPrimaryColor();
	}, []);

	const userLogin = user ? user.login : String(login);

	return (
		<>
			<PageTitle
				title={[
					userLogin,
					projectData ? projectData.name : String(project),
				]}
			/>
			<div className="relative px-4 py-10">
				<h1 className="text-2xl font-bold">
					<Link href={`/users/${userLogin}`}>{userLogin}</Link>
					's{" "}
					<Link href={`/projects/${project}`}>
						{projectData ? projectData.name : project}
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
