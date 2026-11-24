import type { PageLoad } from './$types';
import type { FtEvent } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	const primaryCampusId = parentData.primaryCampusId ?? 1;

	try {
		const res = await fetch(`/api/v2/campus/${primaryCampusId}/events?page[size]=100&sort=-begin_at`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				events: [] as FtEvent[],
				primaryCampusId,
				error: err?.message || `Failed to load campus events (${res.status})`,
				title: 'Campus Events'
			};
		}

		const data = await res.json();
		return {
			events: (Array.isArray(data) ? data : []) as FtEvent[],
			primaryCampusId,
			error: null,
			title: 'Campus Events',
			intraUrl: 'https://profile.intra.42.fr/events'
		};
	} catch (err: any) {
		return {
			events: [] as FtEvent[],
			primaryCampusId,
			error: err?.message || 'Network error while loading campus events',
			title: 'Campus Events',
			intraUrl: 'https://profile.intra.42.fr/events'
		};
	}
};
