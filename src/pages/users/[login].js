import { useRouter } from "next/router";
import { useState } from "react";
import { useUserState } from "@context/user";
import Layout from "@components/Layout";

async function getUser(login) {
	const { token } = useUserState();
	const result = fetch(`https://api.intra.42.fr/v2/users/${login}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then((response) => response.json());
	return result;
}

export default function Profile() {
	const router = useRouter();
	// const [user, setUser] = useState();
	const { login } = router.query;

	// const result = getUser(login);
	// setUser(result);

	// if (!user) return "loading...";
	return (
		<Layout>
			Were looking for <code>{login}</code>?
		</Layout>
	);
}
