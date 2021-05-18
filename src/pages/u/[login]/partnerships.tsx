import { useRouter } from "next/router";
import useAPI from "@/lib/useAPI";
import { getLayout } from "@/components/layouts/UserLayout";
import { EyeOffIcon } from "@heroicons/react/outline";
import { User } from "@/types/User";

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

	if (isLoading || isError) return <>Loading or error</>;

	if (!user.partnerships.length)
		return (
			<div className="flex flex-col items-center w-full mt-4">
				<EyeOffIcon className="w-32 h-32 mb-2" />
				<p>
					No partnerships for{" "}
					<span className="font-bold">{login}</span> yet.
				</p>
			</div>
		);

	return (
		<>
			<table className="w-full">
				<thead>
					<tr>
						<th>Partnership</th>
						<th>Slug</th>
						<th>Difficulty</th>
						<th>Skills</th>
					</tr>
				</thead>
				<tbody>
					{user.partnerships.map((p) => (
						<tr key={p.id} className="text-center">
							<td>{p.name}</td>
							<td>{p.slug}</td>
							<td>{p.difficulty}</td>
							<td>
								{p.partnerships_skills.map(
									(skill) => skill.skill_id + " "
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

UserPartnerships.getLayout = getLayout;

export default UserPartnerships;
