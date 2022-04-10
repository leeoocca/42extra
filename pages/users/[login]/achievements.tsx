import useAPI from "lib/useAPI";
import Image from "next/image";
import { useRouter } from "next/router";
import emptyState from "public/coding.gif";
import { User } from "types/42";
import AchievementCard from "ui/AchievementCard";
import CardGrid from "ui/CardGrid";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";

export default function UserAchievements() {
	const {
		query: { login },
	} = useRouter();

	const { data: user, isLoading, error } = useAPI<User>(`/v2/users/${login}`);

	if (isLoading) return <Loading />;
	if (error) return <>Error</>;

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

	const kinds = [...new Set<string>(user.achievements.map((a) => a.kind))];

	const names = [...new Set<string>(user.achievements.map((a) => a.name))];

	return (
		<>
			{kinds.map((kind) => (
				<section key={kind} id={kind} className="mb-10">
					<h2 className="mb-4 text-3xl font-bold tracking-tight">
						{kind.replace(/^\w/, (c) => c.toUpperCase())}
					</h2>
					<CardGrid>
						{user.achievements.map((a) => {
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
