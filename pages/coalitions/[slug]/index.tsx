import { useRouter } from "next/router";

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
			<img
				src={coalition.cover_url}
				alt=""
				className="object-cover w-16 h-16"
			/>
			<img
				src={coalition.image_url}
				alt=""
				className="object-contain w-16 h-16"
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
