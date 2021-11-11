import { useRouter } from "next/router";

import { Heading } from "theme-ui";

import useAPI from "lib/useAPI";
import getTimeAgo from "lib/getTimeAgo";
import Loading from "ui/Loading";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import { getLayout } from "ui/layouts/UserLayout";

const Quest = ({ quest }) => (
	<Card>
		<div className="flex flex-col h-32 overflow-hidden text-sm place-content-end">
			<h2 className="text-base font-semibold">{quest.quest.name}</h2>
			<p>{quest.quest.description}</p>
			<p>
				<span className="text-xs uppercase">{quest.quest.kind}</span>
				{quest.validated_at && (
					<>
						{" "}
						–{" "}
						<time title={quest.validated_at} className="opacity-75">
							{getTimeAgo(quest.validated_at)}
						</time>
					</>
				)}
			</p>
		</div>
	</Card>
);

function UserQuests() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: quests,
		isLoading,
		isError,
	} = useAPI(`/v2/users/${login}/quests_users`);

	if (isLoading) return <Loading />;
	if (isError) return <>Error</>;

	if (!quests.length)
		return (
			<>
				No quests for <b>{login}</b>.
			</>
		);

	const validated = quests.filter((quest) => quest.validated_at);
	const not_validated = quests.filter((quest) => !quest.validated_at);

	return (
		<>
			<CardGrid>
				{validated.map((quest) => (
					<Quest quest={quest} key={quest.id} />
				))}
			</CardGrid>
			<Heading mb={2} mt={4}>
				Not validated yet
			</Heading>
			<CardGrid>
				{not_validated.map((quest) => (
					<Quest quest={quest} key={quest.id} />
				))}
			</CardGrid>
		</>
	);
}

UserQuests.getLayout = getLayout;

export default UserQuests;
