import useAPI from "@/lib/useAPI";
import { getLayout } from "@/components/layouts/UserLayout";
import { useRouter } from "next/router";

function UserScales() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: scales,
		isLoading,
		isError,
	}: {
		data: any; // @todo add scales interface
		isLoading: boolean;
		isError: boolean;
	} = useAPI(`/v2/users/${login}/scale_teams`);

	if (isLoading || isError) return <>Loading or error</>;

	return (
		<>
			<table className="w-full">
				<thead>
					<tr>
						<th>Scale</th>
						<th>Comment</th>
						<th>Feedback</th>
						<th>Final mark</th>
					</tr>
				</thead>
				<tbody>
					{scales.map((s) => (
						<tr key={s.id}>
							<td>{s.scale_id}</td>
							<td className="w-2/5">{s.comment}</td>
							<td className="w-2/5">{s.feedback}</td>
							<td
								className={`${
									s.flag.positive
										? "text-green-400"
										: "text-red-600"
								}`}
							>
								{s.final_mark} — {s.flag.name}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

UserScales.getLayout = getLayout;

export default UserScales;
