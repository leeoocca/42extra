import { useEffect } from "react";
import useSWR, { KeyedMutator } from "swr";

import { Campus, Cursus } from "types/42";
import { useAPIError } from "./APIError";

export default function useAPI<Type>(
	uri: string,
	options?
): {
	data: Type;
	isLoading: boolean;
	error: Error;
	mutate: KeyedMutator<Type>;
} {
	const { data, error, mutate } = useSWR([`/api${uri}`], { ...options });
	const { errors, setErrors } = useAPIError();

	useEffect(() => {
		error && setErrors([error, ...errors]);
	}, [error]);
	// setTimeout(() =>, 0);

	return {
		data,
		isLoading: !error && !data,
		error,
		mutate,
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
