import useSWR from "swr";

function useAPI<Type>(uri: string): {
	data: Type;
	isLoading: boolean;
	isError: any;
} {
	const { data, error } = useSWR([`/api${uri}`]);

	return {
		data,
		isLoading: !error && !data,
		isError: error,
	};
}

export default useAPI;
