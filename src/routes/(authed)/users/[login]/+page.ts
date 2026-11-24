import type { PageLoad } from './$types';
import type { FtUserMe } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ params, fetch }) => {
	const login = params.login;

	try {
		const res = await fetch(`/api/v2/users/${login}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				userProfile: null as FtUserMe | null,
				login,
				error: err?.message || `Failed to load user ${login} (${res.status})`,
				title: ['Users', login]
			};
		}

		const data = await res.json();
		return {
			userProfile: data as FtUserMe,
			login,
			error: null,
			title: ['Users', login],
			intraUrl: `https://profile.intra.42.fr/users/${login}`
		};
	} catch (err: any) {
		return {
			userProfile: null as FtUserMe | null,
			login,
			error: err?.message || `Network error while loading user ${login}`,
			title: ['Users', login],
			intraUrl: `https://profile.intra.42.fr/users/${login}`
		};
	}
};
