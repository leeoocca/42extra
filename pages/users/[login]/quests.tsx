import { Flex, Heading, Text } from "@theme-ui/components";
import { getUserQuestsLink } from "lib/intraLink";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { QuestUser } from "types/42";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";
import RelativeTime from "ui/RelativeTime";

const Quest = ({ quest }) => (
	<Card>
		<div className="flex flex-col h-32 overflow-hidden text-sm place-content-end">
			<h2 className="text-base font-semibold">{quest.quest.name}</h2>
			<p>{quest.quest.description}</p>
			<Flex sx={{ gap: 2 }}>
				<Text sx={{ fontVariant: "all-small-caps" }}>
					{quest.quest.kind}
				</Text>
				{quest.validated_at && (
					<Text sx={{ fontSize: 1, color: "gray" }}>
						<RelativeTime date={quest.validated_at} />
					</Text>
				)}
			</Flex>
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
UserQuests.getApiLink = getUserQuestsLink();
