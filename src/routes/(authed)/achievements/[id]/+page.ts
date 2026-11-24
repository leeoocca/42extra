import type { PageLoad } from './$types';
import type { FtAchievement } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id;

	try {
		const res = await fetch(`/api/v2/achievements/${id}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				achievement: null as any,
				id,
				error: err?.message || `Failed to load achievement ${id} (${res.status})`,
				title: ['Achievements', id]
			};
		}

		const data = await res.json();
		return {
			achievement: data,
			id,
			error: null,
			title: ['Achievements', data?.name || id],
			intraUrl: null
		};
	} catch (err: any) {
		return {
			achievement: null as any,
			id,
			error: err?.message || `Network error while loading achievement ${id}`,
			title: ['Achievements', id],
			intraUrl: null
		};
	}
};
