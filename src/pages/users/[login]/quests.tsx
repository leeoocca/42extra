import { useRouter } from "next/router";
import Layout from "@components/Layout";
import { getUserNavLinks } from "@utils/NavLinks";
import UserHeader from "@components/headers/UserHeader";
import useAPI from "@lib/useAPI";

function UserQuests() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);
	const { data: quests, isLoading: isLoading2, isError: isError2 } = useAPI(
		`/v2/users/${login}/quests_users`
	);

	if (isLoading || isError || isLoading2 || isError2)
		return <Layout>Loading or error</Layout>;

	return (
		<Layout
			navLinks={getUserNavLinks(String(login), 2)}
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
		</Layout>
	);
}

export default UserQuests;
