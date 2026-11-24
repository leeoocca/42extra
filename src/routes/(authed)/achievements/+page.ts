import type { PageLoad } from './$types';
import type { FtAchievement } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	const userLogin = parentData.profile?.login;

	try {
		const res = await fetch('/api/v2/achievements?page[size]=100&sort=name');
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				achievements: [] as FtAchievement[],
				error: err?.message || `Failed to load achievements (${res.status})`,
				title: 'Achievements'
			};
		}

		const data = await res.json();
		return {
			achievements: (Array.isArray(data) ? data : []) as FtAchievement[],
			error: null,
			title: 'Achievements',
			intraUrl: userLogin ? `https://profile.intra.42.fr/users/${userLogin}/achievements` : null
		};
	} catch (err: any) {
		return {
			achievements: [] as FtAchievement[],
			error: err?.message || 'Network error while loading achievements',
			title: 'Achievements',
			intraUrl: null
		};
	}
};
