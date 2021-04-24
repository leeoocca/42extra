import { useRouter } from "next/router";
import useAPI from "@lib/useAPI";
import { getLayout } from "@components/layouts/UserLayout";

function UserAchievements() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);

	if (isLoading || isError) return <>Loading or error</>;

	return (
		<>
			<table className="w-full">
				<tr>
					<th>Achievement</th>
					<th>Description</th>
					<th>Kind</th>
					<th>Tier</th>
					<th>Number</th>
				</tr>
				{user.achievements.map((achievement) => (
					<tr key={achievement.id} className="text-center">
						<td className="flex items-center p-2 text-left">
							<img
								src={
									"https://cdn.intra.42.fr" +
									achievement.image.replace("/uploads", "")
								}
								className="w-10 mr-4"
							/>
							{achievement.name}
						</td>
						<td>{achievement.description}</td>
						<td>{achievement.kind}</td>
						<td>
							{achievement.tier !== "none" && achievement.tier}
						</td>
						<td>{achievement.nbr_of_success}</td>
					</tr>
				))}
			</table>
		</>
	);
}

UserAchievements.getLayout = getLayout;

export default UserAchievements;
