import { useRouter } from "next/router";

import { Heading } from "@theme-ui/components";

import CoalitionHeader from "ui/headers/CoalitionHeader";
import Loader from "ui/Loader";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserCard from "ui/UserCard";
import UserCardWithDetails from "ui/UserCardWithDetails";
import UserGrid from "ui/UserGrid";

export default function CoalitionIndex() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: coalition } = useAPI(`/v2/coalitions/${slug}`);
	const { data: users } = useAPI(
		`/v2/coalitions/${slug}/coalitions_users?page[size]=20&sort=-this_year_score`
	);

	if (!coalition) return <Loading />;

	return (
		<>
			<Heading my={2}>Master</Heading>
			<UserCard id={coalition.user_id} />
			<Heading my={2}>Leaderboard</Heading>
			{users ? (
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
			) : (
				<Loader />
			)}
		</>
	);
}

CoalitionIndex.header = CoalitionHeader;
