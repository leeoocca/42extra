import { useRouter } from "next/router";
import useAPI from "@lib/useAPI";
import { getLayout } from "@components/layouts/UserLayout";

function UserQuests() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);
	const { data: quests, isLoading: isLoading2, isError: isError2 } = useAPI(
		`/v2/users/${login}/quests_users`
	);

	if (isLoading || isError || isLoading2 || isError2)
		return <>Loading or error</>;

	return (
		<>
			<table className="w-full">
				<tr>
					<th>Quest</th>
					<th>Description</th>
					<th>Validated at</th>
				</tr>
				{quests.map((quest) => (
					<tr key={quest.id} className="text-center">
						<td className="text-left">{quest.quest.name}</td>
						<td>{quest.quest.description}</td>
						<td>{quest.validated_at}</td>
					</tr>
				))}
			</table>
		</>
	);
}

UserQuests.getLayout = getLayout;

export default UserQuests;
