import useSWR from "swr";
import { useSession, signIn } from "next-auth/client";

function useAPI(uri: string) {
	const [session, loading] = useSession();

	if (loading)
		return {
			data: null,
			isLoading: true,
			isError: null,
		};

	// console.log(session);

	// if (Date.now() > session.iat + 7200) signIn("42");

	const { data, error } = useSWR([
		`https://api.intra.42.fr${uri}`,
		session.accessToken,
	]);

	return {
		data,
		isLoading: !error && !data,
		isError: error,
	};
}

export default useAPI;
