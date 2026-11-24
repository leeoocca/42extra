import type { PageLoad } from './$types';
import type { FtCampus } from '#lib/schemas/42.js';
import { getCampusLinks } from '#lib/config/links.js';

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

	const links = getCampusLinks(primaryCampusId);

	return {
		links,
		campuses,
		primaryCampusId,
		title: 'Useful Links',
		intraUrl: null
	};
};
