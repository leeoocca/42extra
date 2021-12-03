import { useRouter } from "next/router";

import AchievementCard from "ui/AchievementCard";
import CardGrid from "ui/CardGrid";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import CursusHeader from "ui/headers/CursusHeader";

export default function CursusAchievements() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: achievements } = useAPI(`/v2/cursus/${slug}/achievements`);

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
