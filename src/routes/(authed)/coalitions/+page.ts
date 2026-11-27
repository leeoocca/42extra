import type { PageLoad } from './$types';
import type { FtBloc } from '#lib/schemas/42.js';

async function hydrateBlocCoalitions(
	fetchFn: typeof fetch,
	blocs: FtBloc[]
): Promise<FtBloc[]> {
	const hydrated = await Promise.all(
		blocs.map(async (bloc) => {
			if (bloc.coalitions && bloc.coalitions.length > 0) {
				return bloc;
			}
			try {
				const cRes = await fetchFn(`/api/v2/blocs/${bloc.id}/coalitions`);
				if (cRes.ok) {
					const cJson = await cRes.json();
					return {
						...bloc,
						coalitions: Array.isArray(cJson) ? cJson : []
					};
				}
			} catch {
				// Fallback
			}
			return bloc;
		})
	);
	return hydrated;
}

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	const primaryCampusId = parentData.primaryCampusId ?? 1;

	try {
		// 1. Load blocs for the user's primary campus
		const res = await fetch(`/api/v2/blocs?filter[campus_id]=${primaryCampusId}&page[size]=100`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				blocs: Promise.resolve([] as FtBloc[]),
				primaryCampusId,
				error: err?.message || `Failed to load blocs (${res.status})`,
				title: 'Coalitions'
			};
		}

		let blocs: FtBloc[] = (await res.json()) || [];
		if (!Array.isArray(blocs)) blocs = [];

		return {
			blocs: hydrateBlocCoalitions(fetch, blocs),
			primaryCampusId,
			error: null,
			title: 'Coalitions',
			intraUrl: null
		};
	} catch (err: any) {
		return {
			blocs: Promise.resolve([] as FtBloc[]),
			primaryCampusId,
			error: err?.message || 'Network error while loading coalitions',
			title: 'Coalitions',
			intraUrl: null
		};
	}
};
