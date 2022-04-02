import { useRouter } from "next/router";

import { Flex, Heading, Text } from "@theme-ui/components";

import { QuestUser } from "types/42";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import getTimeAgo from "lib/getTimeAgo";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";

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

export default function UserQuests() {
	const {
		query: { login },
	} = useRouter();

	const {
		data: quests,
		isLoading,
		error,
	} = useAPI<QuestUser[]>(`/v2/users/${login}/quests_users`);

	if (isLoading) return <Loading />;
	if (error) return <>Error</>;

	if (!quests.length)
		return (
			<Text>
				No quests for <b>{login}</b>.
			</Text>
		);

	let validated = [],
		not_validated = [];

	quests.forEach((q) => {
		if (q.validated_at) validated.push(q);
		else not_validated.push(q);
	});

	return (
		<>
			<CardGrid>
				{validated.map((quest) => (
					<Quest quest={quest} key={quest.id} />
				))}
			</CardGrid>
			{not_validated.length ? (
				<>
					<Heading mb={2} mt={4}>
						Not validated yet
					</Heading>
					<CardGrid>
						{not_validated.map((quest) => (
							<Quest quest={quest} key={quest.id} />
						))}
					</CardGrid>
				</>
			) : (
				""
			)}
		</>
	);
}

UserQuests.header = UserHeader;
