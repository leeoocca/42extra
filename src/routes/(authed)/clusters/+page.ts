import type { PageLoad } from './$types';
import type { FtCampus } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	const primaryCampusId = parentData.primaryCampusId ?? 1;

	let campuses: FtCampus[] = parentData.profile?.campus ?? [];
	if (campuses.length === 0) {
		try {
			const cRes = await fetch('/api/v2/campus?page[size]=100&sort=name');
			if (cRes.ok) {
				const cJson = await cRes.json();
				campuses = Array.isArray(cJson) ? cJson : (cJson.campuses ?? []);
			}
		} catch {}
	}

	return {
		campuses,
		initialCampusId: primaryCampusId,
		title: 'Clusters',
		intraUrl: 'https://meta.intra.42.fr/clusters'
	};
};
