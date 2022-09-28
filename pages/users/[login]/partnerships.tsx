import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { User } from "types/42";
import Card from "ui/cards/Card";
import CardGrid from "ui/grids/CardGrid";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";

export default function UserPartnerships() {
	const {
		query: { login },
	} = useRouter();

	const { data: user, isLoading, error } = useAPI<User>(`/v2/users/${login}`);

	if (isLoading) return <Loading />;

	if (error) return <>Error</>;

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
