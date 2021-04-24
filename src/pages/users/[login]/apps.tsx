import { useRouter } from "next/router";
import Layout from "@components/Layout";
import { getUserNavLinks } from "@utils/NavLinks";
import UserHeader from "@components/headers/UserHeader";
import useAPI from "@lib/useAPI";
import Link from "next/link";

function UserEvaluations() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);
	const { data: apps, isLoading: isLoading2, isError: isError2 } = useAPI(
		`/v2/users/${login}/apps`
	);

	if (isLoading || isError || isLoading2 || isError2)
		return <Layout>Loading or error</Layout>;

	console.log(apps);
	return (
		<Layout
			navLinks={getUserNavLinks(String(login), 4)}
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
					<th>App</th>
					<th>Description</th>
					<th>Website</th>
					<th>Public</th>
				</tr>
				{apps.map((app) => {
					let domain = new URL(app.website);
					return (
						<tr key={app.id} className="text-center">
							<td>{app.name}</td>
							<td>{app.description}</td>
							<td>
								<Link href={app.website}>
									<a>{domain.hostname}</a>
								</Link>
							</td>
							<td>{app.public ? "true" : "false"}</td>
						</tr>
					);
				})}
			</table>
		</Layout>
	);
}

export default UserEvaluations;
