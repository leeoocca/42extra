import { useRouter } from "next/router";

import useAPI from "lib/useAPI";
import { User } from "types/User";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import { getLayout } from "ui/layouts/UserLayout";
import Loading from "ui/Loading";

function UserPartnerships() {
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

UserPartnerships.getLayout = getLayout;

export default UserPartnerships;
