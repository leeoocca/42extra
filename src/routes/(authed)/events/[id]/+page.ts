import type { PageLoad } from './$types';
import type { FtEvent } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id;

	try {
		const res = await fetch(`/api/v2/events/${id}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				event: null as any,
				id,
				error: err?.message || `Failed to load event ${id} (${res.status})`,
				title: ['Events', id]
			};
		}

		const data = await res.json();
		return {
			event: data,
			id,
			error: null,
			title: ['Events', data?.name || id],
			intraUrl: `https://profile.intra.42.fr/events/${id}`
		};
	} catch (err: any) {
		return {
			event: null as any,
			id,
			error: err?.message || `Network error while loading event ${id}`,
			title: ['Events', id],
			intraUrl: `https://profile.intra.42.fr/events/${id}`
		};
	}
};
