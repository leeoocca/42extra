import { fetch42 } from '$lib/api';
import type { FortyTwoUser } from '$lib/types/ft';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
	const { session } = await parent();

	const me: Promise<FortyTwoUser> = fetch42('me', {
		accessToken: session?.access_token || '',
		fetch
	});

	const events_users: Promise<any> = fetch42(`users/${session?.userId}/events_users`, {
		accessToken: session?.access_token || '',
		fetch
	});

	return { me, events_users };
};
