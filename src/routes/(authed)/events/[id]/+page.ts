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

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id;

	try {
		const res = await fetch(`/api/v2/events/${id}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				event: null as any,
				subscribers: [] as EventUserItem[],
				feedbacks: [] as EventFeedbackItem[],
				id,
				error: err?.message || `Failed to load event ${id} (${res.status})`,
				title: ['Events', id],
				intraUrl: `https://profile.intra.42.fr/events/${id}`
			};
		}

		const eventData = await res.json();

		// Fetch event participants (events_users) and feedbacks in parallel
		const [usersRes, feedbacksRes] = await Promise.all([
			fetch(`/api/v2/events/${id}/events_users?page[size]=100`),
			fetch(`/api/v2/events/${id}/feedbacks?page[size]=100`)
		]);

		let subscribers: EventUserItem[] = [];
		if (usersRes.ok) {
			const uJson = await usersRes.json();
			if (Array.isArray(uJson)) {
				subscribers = uJson;
			}
		}

		let feedbacks: EventFeedbackItem[] = [];
		if (feedbacksRes.ok) {
			const fJson = await feedbacksRes.json();
			if (Array.isArray(fJson)) {
				feedbacks = fJson;
			}
		}

		return {
			event: eventData,
			subscribers,
			feedbacks,
			id,
			error: null,
			title: ['Events', eventData?.name || id],
			intraUrl: `https://profile.intra.42.fr/events/${id}`
		};
	} catch (err: any) {
		return {
			event: null as any,
			subscribers: [] as EventUserItem[],
			feedbacks: [] as EventFeedbackItem[],
			id,
			error: err?.message || `Network error while loading event ${id}`,
			title: ['Events', id],
			intraUrl: `https://profile.intra.42.fr/events/${id}`
		};
	}
};
