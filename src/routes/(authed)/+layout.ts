import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import type { FtUserMe } from '#lib/schemas/42.js';

export const load: LayoutLoad = async ({ parent, fetch, url }) => {
	const { user, session } = await parent();

	if (!user) {
		const redirectTo = `${url.pathname}${url.search}`;
		if (redirectTo && redirectTo !== '/') {
			redirect(307, `/signin?redirect=${encodeURIComponent(redirectTo)}`);
		}
		redirect(307, '/signin');
	}

	let profile: FtUserMe | null = null;
	try {
		const res = await fetch('/api/v2/me');
		if (res.ok) {
			profile = (await res.json()) as FtUserMe;
		}
	} catch {
		// Non-blocking fallback
	}

	const primaryCampusUser = profile?.campus_users?.find((cu) => cu.is_primary);
	const primaryCampus =
		profile?.campus?.find((c) => c.id === primaryCampusUser?.campus_id) ??
		profile?.campus?.[0] ??
		null;

	return {
		user,
		session,
		profile,
		primaryCampus,
		primaryCampusId: primaryCampus?.id ?? 1
	};
};

export const ssr = false;
