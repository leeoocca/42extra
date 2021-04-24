import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";
import useSWR from "swr";
import Layout from "@components/Layout";
import { LinkListNode } from "@interfaces/LinkListNode";
import UserHeader from "@components/headers/UserHeader";
import { getUserNavLinks } from "@utils/NavLinks";

function UserOverview() {
	const router = useRouter();
	const { login } = router.query;
	const [session, loading] = useSession();

	if (loading) return <Layout>loading...</Layout>;
	const { data: user, error } = useSWR([
		`https://api.intra.42.fr/v2/users/${login}`,
		session.accessToken,
	]);
	const { data: coalition, error: error2 } = useSWR([
		`https://api.intra.42.fr/v2/users/${login}/coalitions`,
		session.accessToken,
	]);

	const breadcrumbs: LinkListNode[] = [
		{ name: "users", uri: "/users" },
		{ name: String(login), uri: `/users/${login}`, isActive: true },
	];

	if (error || error2) {
		if (error && error.status === 401) signIn("42");
		return <Layout>{error && error.status}</Layout>;
	}
	if (!user) return <Layout>loading...</Layout>;

	return (
		<Layout
			breadcrumbs={breadcrumbs}
			navLinks={getUserNavLinks(String(login), 0)}
			header={
				<UserHeader
					login={String(login)}
					fullName={user.usual_full_name}
					imageUrl={user.image_url}
				/>
			}
		>
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
			{coalition && (
				<code className="block">coalition: {coalition[0]?.name}</code>
			)}
		</Layout>
	);
}

export default UserOverview;
