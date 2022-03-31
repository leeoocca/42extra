import { useRouter } from "next/router";

import { Achievement } from "types/42";
import AchievementCard from "ui/AchievementCard";
import CardGrid from "ui/CardGrid";
import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";

export default function CursusAchievements() {
	const router = useRouter();
	const { slug } = router.query;

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
