import { useRouter } from "next/router";
import Image from "next/image";

import SVG from "react-inlinesvg";

import useAPI from "lib/useAPI";
import Loading from "ui/Loading";
import UserGrid from "ui/UserGrid";
import UserCardWithDetails from "ui/UserCardWithDetails";

function CoalitionIndex() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: coalition } = useAPI(`/v2/coalitions/${slug}`);
	const { data: users } = useAPI(`/v2/coalitions/${slug}/coalitions_users`);

	if (!coalition) return <Loading />;

	document.documentElement.style.setProperty("--nav", coalition.color + "DD");

	return (
		<>
			<h1>{coalition.name}</h1>
			<p>Score: {coalition.score}</p>
			<SVG
				src={coalition.image_url}
				fill="white"
				width="4rem"
				height="4rem"
				className="object-contain w-16 h-16"
			/>
			<Image
				src={coalition.cover_url}
				className="object-cover w-16 h-16"
				width={64}
				height={64}
				quality={100}
				alt=""
			/>
			{users && (
				<UserGrid>
					{users.map((user) => {
						const details = [
							{ name: "Rank", value: user.rank },
							{ name: "Score", value: user.score },
						];
						return (
							<UserCardWithDetails
								key={user.user_id}
								user={user.user_id}
								details={details}
							/>
						);
					})}
				</UserGrid>
			)}
		</>
	);
}

export default CoalitionIndex;
