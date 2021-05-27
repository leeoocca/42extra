import { useRouter } from "next/router";
import useAPI from "@/lib/useAPI";
import { getLayout } from "@/layouts/UserLayout";
import { Achievement, User } from "@/types/User";
import AchievementCard from "@/components/AchievementCard";
import CardGrid from "@/components/CardGrid";

function UserAchievements() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: user,
		isLoading,
		isError,
	}: { data: User; isLoading: boolean; isError: any } = useAPI(
		`/v2/users/${login}`
	);

	if (isLoading) return <>Loading...</>;
	if (isError) return <>Error</>;

	if (!user.achievements.length)
		return (
			<div className="flex flex-col items-center w-full mt-4">
				<img src="https://i.chzbgr.com/full/8270686464/h7779056E/coding-is-an-art" />
				<p>
					No achievements for{" "}
					<span className="font-bold">{login}</span>.
				</p>
			</div>
		);

	const kinds = [
		...new Set<string>(user.achievements.map((a: Achievement) => a.kind)),
	];

	return (
		<>
			{kinds.map((kind) => (
				<section key={kind} id={kind} className="mb-10">
					<h2 className="mb-4 text-3xl font-bold tracking-tight">
						{kind.replace(/^\w/, (c) => c.toUpperCase())}
					</h2>
					<CardGrid>
						{user.achievements.map((a: Achievement) => {
							if (a.kind === kind)
								return <AchievementCard key={a.id} a={a} />;
						})}
					</CardGrid>
				</section>
			))}
		</>
	);
}

UserAchievements.getLayout = getLayout;

export default UserAchievements;
