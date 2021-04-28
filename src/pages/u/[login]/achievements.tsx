import { useRouter } from "next/router";
import useAPI from "@/lib/useAPI";
import { getLayout } from "@/components/layouts/UserLayout";
import { TrendingDownIcon } from "@heroicons/react/solid";
import { Achievement, User } from "@/types/User";
import AchievementCard from "@/components/AchievementCard";

function AchievementsGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto">
			{children}
		</div>
	);
}
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

	if (isLoading || isError) return <>Loading or error</>;

	if (!user.achievements.length)
		return (
			<div className="flex flex-col items-center w-full mt-4">
				<TrendingDownIcon className="w-32 h-32 mb-2" />
				<p>
					No achievements for{" "}
					<span className="font-bold">{login}</span> yet.
				</p>
			</div>
		);

	const kinds = [
		...new Set<string>(user.achievements.map((a: Achievement) => a.kind)),
	];

	return (
		<>
			{kinds.map((kind) => (
				<section className="mb-10" key={kind}>
					<h3 className="mb-4 text-3xl font-bold">
						{kind.replace(/^\w/, (c) => c.toUpperCase())}
					</h3>
					<AchievementsGrid>
						{user.achievements.map((a: Achievement) => {
							if (a.kind === kind)
								return <AchievementCard key={a.id} a={a} />;
						})}
					</AchievementsGrid>
				</section>
			))}
		</>
	);
}

UserAchievements.getLayout = getLayout;

export default UserAchievements;
