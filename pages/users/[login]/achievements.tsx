import { useRouter } from "next/router";
import Image from "next/image";

import { Achievement, User } from "types/User";
import AchievementCard from "ui/AchievementCard";
import CardGrid from "ui/CardGrid";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";

import emptyState from "public/coding.gif";

export default function UserAchievements() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: user,
		isLoading,
		isError,
	}: { data: User; isLoading: boolean; isError: any } = useAPI(
		`/v2/users/${login}`
	);

	if (isLoading) return <Loading />;
	if (isError) return <>Error</>;

	if (!user.achievements.length)
		return (
			<div className="flex flex-col items-center w-full mt-4">
				<Image src={emptyState} alt="" />
				<p>
					No achievements for{" "}
					<span className="font-bold">{login}</span>.
				</p>
			</div>
		);

	const kinds = [
		...new Set<string>(user.achievements.map((a: Achievement) => a.kind)),
	];

	const names = [
		...new Set<string>(user.achievements.map((a: Achievement) => a.name)),
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

UserAchievements.header = UserHeader;
