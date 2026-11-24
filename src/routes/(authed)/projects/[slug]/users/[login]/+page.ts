import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { slug, login } = params;
	throw redirect(307, `/users/${login}/projects/${slug}`);
};
