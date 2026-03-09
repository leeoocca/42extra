import { fetch42 } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, params }) => {
	const { session } = await parent();

	const user: Promise<any> = fetch42(`users/${params.id}`, {
		accessToken: session?.access_token || '',
		fetch
	});

	return { user };
};
