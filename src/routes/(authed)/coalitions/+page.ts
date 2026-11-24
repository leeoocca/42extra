import type { PageLoad } from './$types';
import type { FtBloc } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	const primaryCampusId = parentData.primaryCampusId ?? 1;

	try {
		// 1. Load blocs for the user's primary campus
		const res = await fetch(`/api/v2/blocs?filter[campus_id]=${primaryCampusId}&page[size]=100`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				blocs: [] as FtBloc[],
				primaryCampusId,
				error: err?.message || `Failed to load blocs (${res.status})`,
				title: 'Coalitions'
			};
		}

		let blocs: FtBloc[] = (await res.json()) || [];
		if (!Array.isArray(blocs)) blocs = [];

		// 2. Ensure coalitions are loaded for each bloc if not embedded
		for (const bloc of blocs) {
			if (!bloc.coalitions || bloc.coalitions.length === 0) {
				try {
					const cRes = await fetch(`/api/v2/blocs/${bloc.id}/coalitions`);
					if (cRes.ok) {
						const cJson = await cRes.json();
						bloc.coalitions = Array.isArray(cJson) ? cJson : [];
					}
				} catch {
					// Fallback
				}
			}
		}

		return {
			blocs,
			primaryCampusId,
			error: null,
			title: 'Coalitions',
			intraUrl: null
		};
	} catch (err: any) {
		return {
			blocs: [] as FtBloc[],
			primaryCampusId,
			error: err?.message || 'Network error while loading coalitions',
			title: 'Coalitions',
			intraUrl: null
		};
	}
};
