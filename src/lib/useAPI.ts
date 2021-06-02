import useSWR from "swr";

function useAPI(uri: string) {
	const { data, error } = useSWR([`/api${uri}`]);

	return {
		data,
		isLoading: !error && !data,
		isError: error,
	};
}

export default useAPI;
