import { useRouter } from "next/router";
import { getLayout } from "@components/layouts/UserLayout";
import useAPI from "@lib/useAPI";

function UserOverview() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);
	const { data: coalition } = useAPI(`/v2/users/${login}/coalitions`);

	if (isError || !user) {
		return <>error</>;
	}
	if (isLoading) return <>loading...</>;

	return (
		<>
			<code className="block">email: {user.email}</code>
			<code className="block">phone: {user.phone}</code>
			<code className="block">
				staff: {user["staff?"] ? "true" : "false"}
			</code>
			<code className="block">
				correction points: {user.correction_point}
			</code>
			<code className="block">{user.wallet} ₳</code>
			<code className="block">
				pool: {user.pool_month} {user.pool_year}
			</code>
			<code className="block">campus[0]: {user?.campus[0]?.name}</code>
			<code className="block">
				location: {user.location || "unavailible"}
			</code>
			<code className="block">
				cursus[0]: {user.cursus_users[0]?.cursus.name}
			</code>
			<code className="block">
				cursus[1]: {user.cursus_users[1]?.cursus.name}
			</code>
			<code className="block">
				languages: {user.languages_users.length}
			</code>
			<code className="block">
				achievements: {user.achievements.length}
			</code>
			<code className="block">anonymize date: {user.anonymize_date}</code>

			<code className="block">
				{coalition !== undefined && coalition[0] !== undefined
					? `coalition: ${coalition[0]?.name}`
					: "no coalition"}
			</code>
		</>
	);
}

UserOverview.getLayout = getLayout;

export default UserOverview;
