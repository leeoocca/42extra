import { useRouter } from "next/router";
import useAPI from "@/lib/useAPI";
import { getLayout } from "@/components/layouts/UserLayout";

function UserQuests() {
	const router = useRouter();
	const { login } = router.query;

	const { data: quests, isLoading, isError } = useAPI(
		`/v2/users/${login}/quests_users`
	);

	if (isLoading || isError) return <>Loading or error</>;

	return (
		<>
			<table className="w-full">
				<thead>
					<tr>
						<th>Quest</th>
						<th>Description</th>
						<th>Validated at</th>
					</tr>
				</thead>
				<tbody>
					{quests.map((quest) => (
						<tr key={quest.id} className="text-center">
							<td className="text-left">{quest.quest.name}</td>
							<td>{quest.quest.description}</td>
							<td>{quest.validated_at}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

UserQuests.getLayout = getLayout;

export default UserQuests;
