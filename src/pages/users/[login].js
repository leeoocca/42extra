import { useRouter } from "next/router";
import { useUserState } from "@context/user";
import Layout from "@components/Layout";

// export default function Profile() {
// 	const router = useRouter()
// 	const { login } = router.query;
// 	const { token } = useUserState();
// 	const result = await fetch(`https://api.intra.42.fr/v2/users/${login}`, {
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 		},
// 	}).then((response) => response.json());
// 	return (
// 	);
// }

function User({ login, stars }) {
	return (
		<div>
			<Layout>
				Were looking for <code>{login}</code>{stars}?
				{/* {result && JSON.stringify(result)} */}
			</Layout>
		</div>
	)
}

export async function getStaticProps(context) {
	const { login } = context.params;
	const res = await fetch('https://api.github.com/repos/developit/preact')
	const json = await res.json()

	return {
		props: {
			stars: json.stargazers_count,
			login,
		},
	}
}

export async function getStaticPaths() {
	return {
		paths: ['/users/lrocca'],
		fallback: true
	}
}

export default User
