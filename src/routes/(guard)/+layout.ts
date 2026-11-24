import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	const { user } = await parent();

	if (user) {
		const redirectParam = url.searchParams.get('redirect');
		const safeRedirect =
			redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
				? redirectParam
				: '/';
		redirect(307, safeRedirect);
	}
};

export const ssr = false;
