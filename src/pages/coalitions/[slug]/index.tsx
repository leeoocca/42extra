import UserCardWithDetails from "@/components/UserCardWithDetails";
import UserGrid from "@/components/UserGrid";
import useAPI from "@/lib/useAPI";
import { useRouter } from "next/router";

function CoalitionIndex() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: coalition } = useAPI(`/v2/coalitions/${slug}`);
	const { data: users } = useAPI(`/v2/coalitions/${slug}/coalitions_users`);

	if (!coalition) return <>Loading...</>;

	document.documentElement.style.setProperty(
		"--color-nav-bg",
		coalition.color + "DD"
	);

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