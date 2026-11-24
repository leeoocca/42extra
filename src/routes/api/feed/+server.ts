import { json, type RequestHandler } from '@sveltejs/kit';
import { fetchFtApiResponse } from '#lib/server/42-api.ts';
import type { FeedItem, FeedResponse } from '#lib/schemas/feed.js';

interface CachedAchievement {
	id: number;
	name: string;
	description?: string;
	tier?: string;
	image?: string;
}

// In-memory cache for achievements dictionary
let achievementsCache: Map<number, CachedAchievement> | null = null;
let achievementsCacheExpiry = 0;

async function getAchievementsMap(
	event: Parameters<RequestHandler>[0]
): Promise<Map<number, CachedAchievement>> {
	const now = Date.now();
	if (achievementsCache && achievementsCacheExpiry > now) {
		return achievementsCache;
	}

	const map = new Map<number, CachedAchievement>();
	try {
		const res = await fetchFtApiResponse(event, '/v2/achievements', {
			searchParams: { 'page[size]': 100 }
		});
		if (res.ok) {
			const data = (await res.json()) as any[];
			if (Array.isArray(data)) {
				for (const a of data) {
					map.set(a.id, {
						id: a.id,
						name: a.name,
						description: a.description,
						tier: a.tier,
						image: a.image
					});
				}
			}
			achievementsCache = map;
			achievementsCacheExpiry = now + 3600 * 1000; // 1 hour
		}
	} catch (e) {
		console.warn('[Feed API] Failed to populate achievements cache:', e);
	}

	return achievementsCache ?? map;
}

export const GET: RequestHandler = async (event) => {
	const url = event.url;
	const campusId = url.searchParams.get('campus_id') || '1';
	const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 100);

	const now = new Date();
	const to = url.searchParams.get('to') || now.toISOString();
	const from =
		url.searchParams.get('from') ||
		new Date(new Date(to).getTime() - 24 * 3600 * 1000).toISOString();

	const nextTo = from;
	const nextFrom = new Date(new Date(from).getTime() - 24 * 3600 * 1000).toISOString();

	const achievementsMapPromise = getAchievementsMap(event);

	// 1. Locations (Cluster Logins)
	const locationsPromise = fetchFtApiResponse(event, `/v2/campus/${campusId}/locations`, {
		searchParams: {
			'range[begin_at]': `${from},${to}`,
			'page[size]': limit,
			sort: '-begin_at'
		}
	})
		.then(async (res) => (res.ok ? ((await res.json()) as any[]) : []))
		.catch(() => [] as any[]);

	// 2. Projects Users (Project Validations, Starts, Submissions)
	const projectsPromise = fetchFtApiResponse(event, '/v2/projects_users', {
		searchParams: {
			'filter[campus]': campusId,
			'range[updated_at]': `${from},${to}`,
			'page[size]': limit,
			sort: '-updated_at'
		}
	})
		.then(async (res) => (res.ok ? ((await res.json()) as any[]) : []))
		.catch(() => [] as any[]);

	// 3. Events (Campus Events, Workshops, Conferences)
	const eventsPromise = fetchFtApiResponse(event, `/v2/campus/${campusId}/events`, {
		searchParams: {
			'range[created_at]': `${from},${to}`,
			'page[size]': limit,
			sort: '-created_at'
		}
	})
		.then(async (res) => {
			if (res.ok) {
				const items = (await res.json()) as any[];
				if (Array.isArray(items) && items.length > 0) return items;
			}
			// Fallback: check events scheduled in this window
			const fallbackRes = await fetchFtApiResponse(event, `/v2/campus/${campusId}/events`, {
				searchParams: {
					'range[begin_at]': `${from},${to}`,
					'page[size]': limit,
					sort: '-begin_at'
				}
			});
			return fallbackRes.ok ? ((await fallbackRes.json()) as any[]) : [];
		})
		.catch(() => [] as any[]);

	// 4. Quests Users
	const questsPromise = fetchFtApiResponse(event, '/v2/quests_users', {
		searchParams: {
			'filter[campus_id]': campusId,
			'range[created_at]': `${from},${to}`,
			'page[size]': limit,
			sort: '-created_at'
		}
	})
		.then(async (res) => (res.ok ? ((await res.json()) as any[]) : []))
		.catch(() => [] as any[]);

	// 5. Achievements Users
	const achievementsUsersPromise = fetchFtApiResponse(event, '/v2/achievements_users', {
		searchParams: {
			'range[created_at]': `${from},${to}`,
			'page[size]': limit,
			sort: '-created_at'
		}
	})
		.then(async (res) => (res.ok ? ((await res.json()) as any[]) : []))
		.catch(() => [] as any[]);

	const [locations, projects, events, quests, achievementsUsers, achievementsMap] =
		await Promise.all([
			locationsPromise,
			projectsPromise,
			eventsPromise,
			questsPromise,
			achievementsUsersPromise,
			achievementsMapPromise
		]);

	const feedItems: FeedItem[] = [];

	// Normalize Locations
	if (Array.isArray(locations)) {
		for (const loc of locations) {
			if (!loc?.id || !loc?.user) continue;
			feedItems.push({
				id: `location-${loc.id}`,
				kind: 'location',
				timestamp: loc.begin_at,
				actor: {
					id: loc.user.id,
					login: loc.user.login,
					displayname: loc.user.displayname,
					image: loc.user.image
				},
				title: `logged in at ${loc.host}`,
				subtitle: loc.end_at ? `Session ended` : 'Active in cluster',
				status: loc.end_at ? 'finished' : 'active',
				link: `/users/${loc.user.login}`,
				metadata: {
					host: loc.host,
					begin_at: loc.begin_at,
					end_at: loc.end_at,
					primary: loc.primary
				}
			});
		}
	}

	// Normalize Projects Users
	if (Array.isArray(projects)) {
		for (const pu of projects) {
			if (!pu?.id || !pu?.project) continue;
			const isValidated = Boolean(pu['validated?'] ?? pu.validated);
			const isFinished = pu.status === 'finished';
			const mark = typeof pu.final_mark === 'number' ? pu.final_mark : null;

			let title = `started ${pu.project.name}`;
			if (isFinished) {
				title = isValidated ? `passed ${pu.project.name}` : `finished ${pu.project.name}`;
			} else if (pu.status === 'searching_a_group') {
				title = `looking for group on ${pu.project.name}`;
			} else if (pu.status === 'in_progress') {
				title = `started ${pu.project.name}`;
			} else {
				title = `working on ${pu.project.name}`;
			}

			feedItems.push({
				id: `project_user-${pu.id}`,
				kind: 'project_user',
				timestamp: pu.updated_at || pu.created_at || pu.marked_at,
				actor: pu.user
					? {
							id: pu.user.id,
							login: pu.user.login,
							displayname: pu.user.displayname,
							image: pu.user.image
						}
					: undefined,
				title,
				subtitle:
					typeof pu.occurrence === 'number' && pu.occurrence > 0
						? `Retry #${pu.occurrence}`
						: undefined,
				status: pu.status,
				mark,
				isValidated,
				link: pu.user?.login
					? `/users/${pu.user.login}/projects/${pu.project.slug || pu.project.id}`
					: `/projects/${pu.project.slug || pu.project.id}`,
				metadata: {
					project_name: pu.project.name,
					project_slug: pu.project.slug,
					occurrence: pu.occurrence,
					status: pu.status
				}
			});
		}
	}

	// Normalize Events
	if (Array.isArray(events)) {
		for (const ev of events) {
			if (!ev?.id) continue;
			const locationStr = ev.location ? ` at ${ev.location}` : '';
			feedItems.push({
				id: `event-${ev.id}`,
				kind: 'event',
				timestamp: ev.created_at || ev.begin_at,
				title: ev.name,
				subtitle: `${ev.kind}${locationStr} • ${ev.nbr_subscribers ?? 0}${ev.max_people ? ` / ${ev.max_people}` : ''} registered`,
				status: ev.kind,
				link: `/events/${ev.id}`,
				metadata: {
					kind: ev.kind,
					location: ev.location,
					begin_at: ev.begin_at,
					end_at: ev.end_at,
					max_people: ev.max_people,
					nbr_subscribers: ev.nbr_subscribers
				}
			});
		}
	}

	// Normalize Quests Users
	if (Array.isArray(quests)) {
		for (const qu of quests) {
			if (!qu?.id || !qu?.quest) continue;
			feedItems.push({
				id: `quest_user-${qu.id}`,
				kind: 'quest_user',
				timestamp: qu.validated_at || qu.updated_at || qu.created_at,
				actor: qu.user
					? {
							id: qu.user.id,
							login: qu.user.login,
							displayname: qu.user.displayname,
							image: qu.user.image
						}
					: undefined,
				title: `completed ${qu.quest.name}`,
				subtitle: undefined,
				status: 'validated',
				isValidated: true,
				link: qu.user ? `/users/${qu.user.login}` : undefined,
				metadata: {
					quest_name: qu.quest.name,
					advancement: qu.advancement,
					prct: qu.prct
				}
			});
		}
	}

	// Normalize Achievements Users
	if (Array.isArray(achievementsUsers)) {
		for (const au of achievementsUsers) {
			if (!au?.id) continue;
			const ach = achievementsMap.get(au.achievement_id);
			feedItems.push({
				id: `achievement_user-${au.id}`,
				kind: 'achievement_user',
				timestamp: au.created_at || au.updated_at,
				actor: {
					id: au.user_id,
					login: au.login,
					displayname: au.login
				},
				title: `unlocked ${ach?.name || `Achievement #${au.achievement_id}`}`,
				subtitle: ach?.description || undefined,
				status: ach?.tier || 'none',
				link: `/achievements/${au.achievement_id}`,
				metadata: {
					achievement_id: au.achievement_id,
					achievement_name: ach?.name,
					tier: ach?.tier,
					image: ach?.image
				}
			});
		}
	}

	// Sort descending by timestamp (most recent first)
	feedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

	const responsePayload: FeedResponse = {
		items: feedItems,
		from,
		to,
		nextFrom,
		nextTo,
		hasMore: true
	};

	return json(responsePayload, {
		headers: {
			'Cache-Control': 'private, max-age=30'
		}
	});
};
