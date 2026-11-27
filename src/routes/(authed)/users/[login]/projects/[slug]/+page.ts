import type { PageLoad } from './$types';
import type { FtUserMe, FtProjectUser, FtTeam, FtProjectDetails } from '#lib/schemas/42.js';

type UserProfileMap = Record<string, { avatar?: string; displayname?: string }>;

async function fetchUserProfiles(
	fetchFn: typeof fetch,
	baseProfiles: UserProfileMap,
	userLogins: Set<string>
): Promise<UserProfileMap> {
	const profiles: UserProfileMap = { ...baseProfiles };
	if (userLogins.size === 0) return profiles;

	try {
		const loginsArray = Array.from(userLogins).slice(0, 50);
		const uRes = await fetchFn(
			`/api/v2/users?filter[login]=${loginsArray.join(',')}&page[size]=100`
		);
		if (uRes.ok) {
			const uList = await uRes.json();
			if (Array.isArray(uList)) {
				for (const cu of uList) {
					profiles[cu.login] = {
						avatar: cu.image?.link ?? cu.image?.versions?.small,
						displayname: cu.usual_full_name || cu.displayname || cu.login
					};
				}
			}
		}
	} catch (e) {
		console.warn('Failed to prefetch user profiles:', e);
	}
	return profiles;
}

export const load: PageLoad = async ({ params, fetch }) => {
	const { login, slug } = params;

	let user: FtUserMe | null = null;
	let project: any = null;
	let projectsUser: (FtProjectUser & { teams?: any[] }) | null = null;
	let teams: FtTeam[] = [];
	let error: string | null = null;

	try {
		// 1. Fetch user profile
		const userRes = await fetch(`/api/v2/users/${login}`);
		if (!userRes.ok) {
			const err = await userRes.json().catch(() => null);
			throw new Error(err?.message || `User not found (${userRes.status})`);
		}
		user = (await userRes.json()) as FtUserMe;

		// 2. Fetch project metadata
		const projRes = await fetch(`/api/v2/projects/${slug}`);
		if (projRes.ok) {
			project = await projRes.json();
		}

		// 3. Find matching projects_user
		const allProjects = (user as any).projects_users || [];
		projectsUser =
			allProjects.find((p: any) => p.project?.slug === slug || String(p.project?.id) === slug) ||
			null;

		if (!projectsUser) {
			error = `@${login} has no registered activity for project "${slug}".`;
		} else {
			// 4. Fetch full teams with scale_teams directly via /api/v2/users/:login/projects/:id/teams
			const projectId = projectsUser.project?.id || project?.id || slug;
			try {
				const teamsRes = await fetch(`/api/v2/users/${login}/projects/${projectId}/teams`);
				if (teamsRes.ok) {
					const teamsData = await teamsRes.json();
					if (Array.isArray(teamsData)) {
						teams = teamsData as FtTeam[];
					}
				} else {
					console.warn(
						`Upstream /users/${login}/projects/${projectId}/teams returned status ${teamsRes.status}`
					);
				}
			} catch (e) {
				console.error(`Error loading teams for user ${login} and project ${projectId}:`, e);
			}

			// Fallback: If endpoint returned empty or failed but projectsUser has candidate teams
			if (teams.length === 0 && projectsUser.teams && projectsUser.teams.length > 0) {
				teams = projectsUser.teams as FtTeam[];
			}

			// Sort teams descending by id (latest attempt first)
			teams.sort((a, b) => b.id - a.id);

			// Extract unique logins (correctors + team members) to prefetch their avatars/profiles
			const userLogins = new Set<string>();
			for (const t of teams) {
				if (t.users) {
					for (const u of t.users) {
						if (u.login) {
							userLogins.add(u.login);
						}
					}
				}
				if (t.scale_teams) {
					for (const st of t.scale_teams) {
						if (st.corrector?.login) {
							userLogins.add(st.corrector.login);
						}
					}
				}
			}

			// Bulk fetch user details asynchronously so teams render immediately
			const baseProfiles: UserProfileMap = {};
			if (user?.login) {
				const userImg = (user as any).image?.link ?? (user as any).image?.versions?.small;
				baseProfiles[user.login] = {
					avatar: userImg,
					displayname: user.usual_full_name || user.displayname || user.login
				};
			}

			return {
				login,
				slug,
				user,
				project,
				projectsUser,
				teams,
				userProfiles: fetchUserProfiles(fetch, baseProfiles, userLogins),
				error,
				title: project ? `${project.name} - @${login}` : `Project @${login}`,
				intraUrl: `https://projects.intra.42.fr/${slug}/${login}`
			};
		}
	} catch (e: any) {
		error = e?.message || 'Error loading user project evaluation details';
	}

	return {
		login,
		slug,
		user,
		project,
		projectsUser,
		teams,
		userProfiles: Promise.resolve({} as UserProfileMap),
		error,
		title: project ? `${project.name} - @${login}` : `Project @${login}`,
		intraUrl: `https://projects.intra.42.fr/${slug}/${login}`
	};
};
