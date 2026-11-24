import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		title: 'Slots & Evaluations',
		intraUrl: 'https://profile.intra.42.fr/slots'
	};
};
