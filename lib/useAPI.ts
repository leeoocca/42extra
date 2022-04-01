import useSWR from "swr";

import { Campus, Cursus } from "types/42";

export default function useAPI<Type>(
	uri: string,
	options?
): {
	data: Type;
	isLoading: boolean;
	isError: any;
} {
	const { data, error } = useSWR([`/api${uri}`], { ...options });

	return {
		data,
		isLoading: !error && !data,
		isError: error,
	};
}

export function useCampuses() {
	return useAPI<Campus[]>("/v2/campus?sort=id&page[size]=100", {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});
}

export function useCursuses() {
	return useAPI<Cursus[]>("/v2/cursus?sort=id&page[size]=100", {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});
}
