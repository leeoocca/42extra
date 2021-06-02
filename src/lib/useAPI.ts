import useSWR from "swr";

function useAPI(uri: string) {
	const { data: session } = useSWR("/api/auth/session");
	const { data, error } = useSWR([`/api${uri}`, session?.accessToken]);

	return {
		data,
		isLoading: !error && !data,
		isError: error,
	};
}

export default useAPI;
