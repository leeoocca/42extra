import useSWR from "swr";
import { useUserState } from "@context/user";

export default function useAPI(uri) {
	const { token } = useUserState();
	const headers = {
		Authorization: `Bearer ${token}`,
	};

	const fetcher = (...args) => fetch(...args).then((res) => res.json());

	const { data, error } = useSWR(
		[`https://api.intra.42.fr/v2/${uri}`, headers],
		fetcher
	);

	return {
		data: data,
		isLoading: !error && !data,
		isError: error,
	};
}
