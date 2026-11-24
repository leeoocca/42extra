import type { PageLoad } from './$types.js';

export interface InitialQueryParam {
	key: string;
	value: string;
}

export const load: PageLoad = async ({ params, url }) => {
	// 1. Path param from route [...path] (e.g. /query/users/raveriss -> params.path = 'users/raveriss')
	// 2. Query param ?endpoint=... fallback if path is empty (e.g. /query?endpoint=campus)
	const pathEndpoint = params.path || '';
	const queryEndpoint = url.searchParams.get('endpoint') || '';

	const rawEndpoint = pathEndpoint || queryEndpoint || 'me';

	// Extract all query params (excluding 'endpoint' if used as fallback)
	const initialParams: InitialQueryParam[] = [];
	for (const [key, value] of url.searchParams.entries()) {
		if (key !== 'endpoint' || pathEndpoint) {
			initialParams.push({ key, value });
		}
	}

	return {
		title: 'Query',
		intraUrl: 'https://api.intra.42.fr/apidoc',
		initialEndpoint: rawEndpoint,
		initialParams
	};
};
