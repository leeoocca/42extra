import useAPI from "lib/useAPI";
import { getLayout } from "ui/layouts/UserLayout";
import { useRouter } from "next/router";
import Link from "next/link";

function UserLocations() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: locations,
		isLoading,
		isError,
	}: {
		data: any; // @todo add location interface
		isLoading: boolean;
		isError: boolean;
	} = useAPI(`/v2/users/${login}/locations`);

	if (isLoading) return <>Loading...</>;
	if (isError) return <>Error</>;

	return (
		<>
			<table className="w-full">
				<thead>
					<tr>
						<th>Host</th>
						<th>Campus</th>
						<th>Begin</th>
						<th>End</th>
						<th>Hours</th>
					</tr>
				</thead>
				<tbody>
					{locations.map((l) => {
						const start = new Date(l.end_at);
						const end = new Date(l.begin_at);
						let total: String | Number = "online";
						if (l.end_at)
							total = Math.round(
								(start.valueOf() - end.valueOf()) /
									1000 /
									60 /
									60
							);
						return (
							<tr key={l.id} className="text-center">
								<td className="font-mono">{l.host}</td>
								<td>
									<Link href={`/campus/${l.campus_id}`}>
										<a>{l.campus_id}</a>
									</Link>
								</td>
								<td className="font-mono">{l.begin_at}</td>
								<td className="font-mono">{l.end_at}</td>
								<td>{total || "<1"}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
}

UserLocations.getLayout = getLayout;

export default UserLocations;
