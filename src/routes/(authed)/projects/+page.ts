import type { PageLoad } from './$types';
import type { FtProjectUser, FtUserMe } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ parent, fetch }) => {
	const parentData = await parent();
	const profile = parentData.profile as FtUserMe | null;

	const initialProjects: FtProjectUser[] = profile?.projects_users ?? [];
	const login = profile?.login;

	return {
		login,
		initialProjects,
		title: 'Projects',
		intraUrl: 'https://projects.intra.42.fr'
	};
};
