import type { PageLoad } from './$types';
import type { FtUserMe } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/v2/me');
		if (!res.ok) {
			const errData = await res.json().catch(() => null);
			return {
				profile: null as FtUserMe | null,
				error: errData?.message || `Failed to load profile (${res.status})`
			};
		}

		const data = await res.json();
		return {
			profile: data as FtUserMe,
			error: null
		};
	} catch (err: any) {
		return {
			profile: null as FtUserMe | null,
			error: err?.message || 'Network error while loading profile'
		};
	}
};
