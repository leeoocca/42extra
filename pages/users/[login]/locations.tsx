import useAPI from "lib/useAPI";
import { getLayout } from "ui/layouts/UserLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import prettyMilliseconds from "pretty-ms";

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

	// group by day

	return (
		<>
			<table className="w-full">
				<thead>
					<tr>
						<th>Host</th>
						<th>Campus</th>
						<th>Begin</th>
						<th>End</th>
						<th>Duration</th>
					</tr>
				</thead>
				<tbody>
					{locations.map((l) => (
						<tr key={l.id} className="text-center">
							<td className="font-mono">{l.host}</td>
							<td>
								<Link href={`/campus/${l.campus_id}`}>
									<a>{l.campus_id}</a>
								</Link>
							</td>
							<td className="font-mono">{l.begin_at}</td>
							<td className="font-mono">{l.end_at}</td>
							<td style={{ textAlign: "left" }}>
								{prettyMilliseconds(
									(Date.parse(l.end_at) || Date.now()) -
										Date.parse(l.begin_at),
									{
										unitCount: 2,
										secondsDecimalDigits: 0,
									}
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

UserLocations.getLayout = getLayout;

export default UserLocations;
