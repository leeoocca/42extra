import { useRouter } from "next/router";

import { User } from "types/42/User";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";

export default function UserPartnerships() {
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

	if (!user.partnerships.length)
		return (
			<div className="flex flex-col items-center w-full mt-4">
				<p>
					No partnerships for{" "}
					<span className="font-bold">{login}</span> yet.
				</p>
			</div>
		);

	return (
		<CardGrid>
			{user.partnerships.map((p) => (
				<Card key={p.id}>
					<div className="flex flex-col place-content-end">
						<p>{p.name}</p>
						<p>{p.slug}</p>
						<p>{p.difficulty}</p>
						<p>
							{p.partnerships_skills.map(
								(skill) => skill.skill_id + " "
							)}
						</p>
					</div>
				</Card>
			))}
		</CardGrid>
	);
}

UserPartnerships.header = UserHeader;
