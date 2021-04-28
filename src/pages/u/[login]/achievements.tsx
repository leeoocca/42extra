import { useRouter } from "next/router";
import useAPI from "@lib/useAPI";
import { getLayout } from "@components/layouts/UserLayout";
import { TrendingDownIcon } from "@heroicons/react/solid";
import { Achievement } from "@interfaces/User";
import AchievementCard from "@components/AchievementCard";

function UserAchievements() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);

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

	return (
		<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto">
			{user.achievements.map((a: Achievement) => (
				<AchievementCard key={a.id} a={a} />
			))}
		</div>
	);
}

UserAchievements.getLayout = getLayout;

export default UserAchievements;
