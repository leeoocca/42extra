import type { PageLoad } from './$types';
import type { FtCursus } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/v2/cursus?page[size]=100&sort=name');
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				cursuses: [] as FtCursus[],
				error: err?.message || `Failed to load cursus list (${res.status})`
			};
		}

		const data = await res.json();
		return {
			cursuses: (Array.isArray(data) ? data : []) as FtCursus[],
			title: 'Cursus',
			error: null
		};
	} catch (err: any) {
		return {
			cursuses: [] as FtCursus[],
			title: 'Cursus',
			error: err?.message || 'Network error while loading cursus list'
		};
	}
};
