import type { PageLoad } from './$types';
import type { FtEvent } from '#lib/schemas/42.js';

export interface EventUserItem {
	id: number;
	event_id: number;
	user_id: number;
	user?: {
		id: number;
		login: string;
		displayname?: string;
		usual_full_name?: string;
		image?: {
			link?: string;
			versions?: { small?: string; medium?: string; large?: string };
		};
		'staff?'?: boolean;
		pool_month?: string;
		pool_year?: string;
	};
}

export interface EventFeedbackItem {
	id: number;
	user?: {
		id: number;
		login: string;
	};
	comment?: string;
	rating?: number;
	created_at?: string;
	feedback_details?: Array<{
		id: number;
		kind: string;
		rate: number;
	}>;
}

async function fetchArray<T>(
	fetchFn: typeof fetch,
	url: string
): Promise<T[]> {
	try {
		const res = await fetchFn(url);
		if (!res.ok) return [];
		const json = await res.json();
		return Array.isArray(json) ? json : [];
	} catch {
		return [];
	}
}

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id;

	try {
		const res = await fetch(`/api/v2/events/${id}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				event: null as any,
				subscribers: Promise.resolve([] as EventUserItem[]),
				feedbacks: Promise.resolve([] as EventFeedbackItem[]),
				id,
				error: err?.message || `Failed to load event ${id} (${res.status})`,
				title: ['Events', id],
				intraUrl: `https://profile.intra.42.fr/events/${id}`
			};
		}

		const eventData = await res.json();

		return {
			event: eventData,
			subscribers: fetchArray<EventUserItem>(fetch, `/api/v2/events/${id}/users?page[size]=100`),
			feedbacks: fetchArray<EventFeedbackItem>(
				fetch,
				`/api/v2/events/${id}/feedbacks?page[size]=100`
			),
			id,
			error: null,
			title: ['Events', eventData?.name || id],
			intraUrl: `https://profile.intra.42.fr/events/${id}`
		};
	} catch (err: any) {
		return {
			event: null as any,
			subscribers: Promise.resolve([] as EventUserItem[]),
			feedbacks: Promise.resolve([] as EventFeedbackItem[]),
			id,
			error: err?.message || `Network error while loading event ${id}`,
			title: ['Events', id],
			intraUrl: `https://profile.intra.42.fr/events/${id}`
		};
	}
};
