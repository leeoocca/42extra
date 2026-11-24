import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		title: 'Calendar',
		intraUrl: 'https://profile.intra.42.fr/slots'
	};
};
