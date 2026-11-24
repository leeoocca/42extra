import type { PageLoad } from './$types';
import type { FtCampus } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/v2/campus?page[size]=100&sort=name');
		if (!res.ok) {
			const errData = await res.json().catch(() => null);
			return {
				campuses: [] as FtCampus[],
				error: errData?.message || `Failed to load campuses (${res.status})`
			};
		}

		const data = await res.json();
		return {
			campuses: (Array.isArray(data) ? data : (data.campuses ?? [])) as FtCampus[],
			title: 'Campuses',
			intraUrl: null,
			error: null
		};
	} catch (err: any) {
		return {
			campuses: [] as FtCampus[],
			title: 'Campuses',
			intraUrl: null,
			error: err?.message || 'Network error while loading campuses'
		};
	}
};
