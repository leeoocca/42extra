import { useRouter } from "next/router";
import { getUserNavLinks } from "@utils/NavLinks";
import UserHeader from "@components/headers/UserHeader";
import useAPI from "@lib/useAPI";
import Link from "next/link";
import { getLayout } from "@components/layouts/UserLayout";

function UserApps() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);
	const { data: apps, isLoading: isLoading2, isError: isError2 } = useAPI(
		`/v2/users/${login}/apps`
	);

	if (isLoading || isError || isLoading2 || isError2)
		return <>Loading or error</>;

	return (
		<>
			<table className="w-full">
				<tr>
					<th>App</th>
					<th>Description</th>
					<th>Website</th>
					<th>Public</th>
				</tr>
				{apps.map((app) => {
					let domain;
					if (app.website.length) {
						domain = new URL(app.website);
					}
					return (
						<tr key={app.id} className="text-center">
							<td>{app.name}</td>
							<td>{app.description}</td>
							<td>
								{app.website && (
									<Link href={app.website}>
										<a>{domain.hostname}</a>
									</Link>
								)}
							</td>
							<td>{app.public ? "true" : "false"}</td>
						</tr>
					);
				})}
			</table>
		</>
	);
}

UserApps.getLayout = getLayout;

export default UserApps;
