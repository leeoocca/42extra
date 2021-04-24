import { useRouter } from "next/router";
import Layout from "@components/layouts/MainLayout";
import useAPI from "@lib/useAPI";
import { getLayout } from "@components/layouts/UserLayout";

function UserProjects() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);

	if (isLoading || isError) return <>Loading or error</>;

	return (
		<>
			<table className="w-full">
				<tr>
					<th>Project</th>
					<th>Final Mark</th>
					<th>Status</th>
					<th>Marked at</th>
				</tr>
				{user.projects_users.map((project) => {
					const options = {
						year: "numeric",
						month: "numeric",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
						hour12: false,
					};
					let date = new Date(project.marked_at).toLocaleString(
						"en",
						options
					);
					return (
						<tr key={project.id} className="text-center">
							<td className="text-left">
								{project.project.name}
							</td>
							<td
								className={`${
									project["validated?"]
										? "text-green-400"
										: "text-red-600"
								}`}
							>
								{project.final_mark}
							</td>
							<td>{project.status}</td>
							<td className="font-mono">{date}</td>
						</tr>
					);
				})}
			</table>
		</>
	);
}

UserProjects.getLayout = getLayout;

export default UserProjects;
