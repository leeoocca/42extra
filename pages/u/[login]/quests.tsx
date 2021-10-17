import { useRouter } from "next/router";
import useAPI from "lib/useAPI";
import { getLayout } from "components/layouts/UserLayout";
import CardGrid from "components/CardGrid";
import Card from "components/Card";
import getTimeAgo from "lib/getTimeAgo";

function UserQuests() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: quests,
		isLoading,
		isError,
	} = useAPI(`/v2/users/${login}/quests_users`);

	if (isLoading) return <>Loading...</>;
	if (isError) return <>Error</>;

	if (!quests.length)
		return (
			<>
				No quests for <b>{login}</b>.
			</>
		);

	return (
		<CardGrid>
			{quests.map((quest) => (
				<Card key={quest.id}>
					<div className="flex flex-col h-32 overflow-hidden text-sm place-content-end">
						<h2 className="text-base font-semibold">
							{quest.quest.name}
						</h2>
						<p>{quest.quest.description}</p>
						<p>
							<span className="text-xs uppercase">
								{quest.quest.kind}
							</span>
							{quest.validated_at && (
								<>
									{" "}
									–{" "}
									<time
										title={quest.validated_at}
										className="opacity-75"
									>
										{getTimeAgo(quest.validated_at)}
									</time>
								</>
							)}
						</p>
					</div>
				</Card>
			))}
		</CardGrid>
	);
}

UserQuests.getLayout = getLayout;

export default UserQuests;
