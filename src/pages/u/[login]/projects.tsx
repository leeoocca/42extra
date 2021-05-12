import { useRouter } from "next/router";
import Layout from "@/components/layouts/MainLayout";
import useAPI from "@/lib/useAPI";
import { getLayout } from "@/components/layouts/UserLayout";
import Link from "next/link";

function UserProjects() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);

	if (isLoading || isError) return <>Loading or error</>;

	return (
		<>
			<table className="w-full">
				<thead>
					<tr>
						<th>Project</th>
						<th>Final Mark</th>
						<th>Status</th>
						<th>Marked at</th>
					</tr>
				</thead>
				<tbody>
					{user.projects_users.map((project) => {
						const options: Intl.DateTimeFormatOptions = {
							year: "numeric",
							month: "numeric",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
							hour12: false,
						};
						let date = null;
						if (project.marked_at)
							date = new Date(project.marked_at).toLocaleString(
								"en",
								options
							);
						return (
							<tr key={project.id} className="text-center">
								<td className="text-left">
									<Link
										href={`/p/${project.project.slug}/${login}`}
									>
										{project.project.name}
									</Link>
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
				</tbody>
			</table>
		</>
	);
}

UserProjects.getLayout = getLayout;

export default UserProjects;
