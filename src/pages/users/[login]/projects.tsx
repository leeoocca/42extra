import { useRouter } from "next/router";
import Layout from "@components/Layout";
import { getUserNavLinks } from "@utils/NavLinks";
import UserHeader from "@components/headers/UserHeader";
import useAPI from "@lib/useAPI";

function UserProjects() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);

	if (isLoading || isError) return <Layout>Loading or error</Layout>;

	return (
		<Layout
			navLinks={getUserNavLinks(String(login), 1)}
			header={
				<UserHeader
					login={String(login)}
					fullName={user.usual_full_name}
					imageUrl={user.image_url}
				/>
			}
		>
			<table className="w-full">
				<tr>
					<th>Project</th>
					<th>Final Mark</th>
					<th>Status</th>
					<th>Marked at</th>
				</tr>
				{user.projects_users.map((project) => (
					<tr key={project.id} className="text-center">
						<td className="text-left">{project.project.name}</td>
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
						<td>{project.marked_at}</td>
					</tr>
				))}
			</table>
		</Layout>
	);
}

export default UserProjects;
