import type { PageLoad } from './$types.js';
import type { FeedResponse } from '#lib/schemas/feed.js';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	const primaryCampusId = parentData.primaryCampusId ?? 1;
	const campusName = parentData.primaryCampus?.name ?? 'Campus';

	try {
		const res = await fetch(`/api/feed?campus_id=${primaryCampusId}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				initialFeed: null as FeedResponse | null,
				campusId: primaryCampusId,
				campusName,
				error: err?.message || `Failed to load campus feed (${res.status})`,
				title: 'Campus Feed'
			};
		}

		const initialFeed = (await res.json()) as FeedResponse;
		return {
			initialFeed,
			campusId: primaryCampusId,
			campusName,
			error: null,
			title: 'Campus Feed'
		};
	} catch (err: any) {
		return {
			initialFeed: null as FeedResponse | null,
			campusId: primaryCampusId,
			campusName,
			error: err?.message || 'Network error while loading campus feed',
			title: 'Campus Feed'
		};
	}
};
