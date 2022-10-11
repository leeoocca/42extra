import { Heading } from "@theme-ui/components";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { Coalition, CoalitionUser } from "types/42";
import CoalitionHeader from "ui/headers/CoalitionHeader";
import Loader from "ui/Loader";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";
import UserCard from "ui/cards/UserCard";
import UserCardWithDetails from "ui/cards/UserCardWithDetails";
import UserGrid from "ui/grids/UserGrid";

export default function CoalitionIndex() {
	const {
		query: { slug },
	} = useRouter();

	const { data: coalition } = useAPI<Coalition>(`/v2/coalitions/${slug}`);
	const { data: users } = useAPI<CoalitionUser[]>(
		`/v2/coalitions/${slug}/coalitions_users?page[size]=20&sort=-this_year_score`
	);

	if (!coalition) return <Loading />;

	return (
		<>
			<PageTitle title={coalition.name} />
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
