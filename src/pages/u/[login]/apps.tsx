import { useRouter } from "next/router";
import useAPI from "@lib/useAPI";
import Link from "next/link";
import { getLayout } from "@components/layouts/UserLayout";
import { EyeOffIcon } from "@heroicons/react/outline";

function UserApps() {
	const router = useRouter();
	const { login } = router.query;

	const { data: apps, isLoading, isError } = useAPI(
		`/v2/users/${login}/apps`
	);

	if (isLoading || isError) return <>Loading or error</>;

	if (!apps.length)
		return (
			<div className="flex flex-col items-center w-full mt-4">
				<EyeOffIcon className="w-32 h-32 mb-2" />
				<p>
					No apps from <span className="font-bold">{login}</span> yet.
				</p>
			</div>
		);

	return (
		<>
			<table className="w-full">
				<thead>
					<tr>
						<th>App</th>
						<th>Description</th>
						<th>Website</th>
						<th>Public</th>
					</tr>
				</thead>
				<tbody>
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
				</tbody>
			</table>
		</>
	);
}

UserApps.getLayout = getLayout;

export default UserApps;
