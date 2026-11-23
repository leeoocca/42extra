import type { LayoutServerLoad } from './$types';
import { fetchFtUserMe } from '#lib/server/42-api.ts';

export const load: LayoutServerLoad = async (event) => {
	let user = event.locals.user;

	// If user is authenticated but has no avatar image in session, resolve from 42 API
	if (user && !user.image) {
		try {
			const profile = await fetchFtUserMe(event);
			const image =
				profile.image?.link ||
				profile.image?.versions?.medium ||
				profile.image?.versions?.small ||
				null;
			if (image) {
				user = {
					...user,
					image
				};
			}
		} catch {
			// Non-blocking fallback
		}
	}

	return {
		user,
		session: event.locals.session
	};
};
