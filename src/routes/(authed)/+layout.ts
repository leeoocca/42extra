import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { user, session } = await parent();

	if (!user) {
		redirect(307, '/signin');
	}

	return {
		user,
		session
	};
};

export const ssr = false;
