import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { Achievement } from "types/42";
import AchievementCard from "ui/cards/AchievementCard";
import CardGrid from "ui/grids/CardGrid";
import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";

export default function CursusAchievements() {
	const {
		query: { slug },
	} = useRouter();

	const { data: achievements } = useAPI<Achievement[]>( // TODO is type AchievementPreview?
		`/v2/cursus/${slug}/achievements`
	);

	if (!achievements) return <Loading />;

	return (
		<>
			<CardGrid>
				{achievements.map((a) => (
					<AchievementCard key={a.id} a={a} />
				))}
			</CardGrid>
		</>
	);
}

CursusAchievements.header = CursusHeader;
