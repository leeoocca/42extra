import useSWR from "swr";
import { useSession } from "next-auth/client";

function useAPI(uri: string) {
	const [session, loading] = useSession();

	if (loading)
		return {
			data: null,
			isLoading: true,
			isError: null,
		};

	const { data, error } = useSWR([`/api${uri}`, session.accessToken]);

	return {
		data,
		isLoading: !error && !data,
		isError: error,
	};
}

export default useAPI;
