import type { PageLoad } from './$types';
import type { FtProjectDetails, FtProjectUser } from '#lib/schemas/42.js';

async function fetchProjectTotals(
	fetchFn: typeof fetch,
	projectId: number,
	primaryCampusId: number
): Promise<{ globalTotal: number; campusTotal: number }> {
	let globalTotal = 0;
	let campusTotal = 0;
	try {
		const [globalRes, campusRes] = await Promise.all([
			fetchFn(`/api/v2/projects/${projectId}/projects_users?page[size]=0`),
			fetchFn(
				`/api/v2/projects/${projectId}/projects_users?filter[campus]=${primaryCampusId}&page[size]=0`
			)
		]);

		if (globalRes.ok) {
			const gTotalHeader = globalRes.headers.get('x-total');
			if (gTotalHeader) globalTotal = Number(gTotalHeader) || 0;
		}

		if (campusRes.ok) {
			const cTotalHeader = campusRes.headers.get('x-total');
			if (cTotalHeader) campusTotal = Number(cTotalHeader) || 0;
		}
	} catch (e) {
		console.warn('Failed to load projects_users totals:', e);
	}
	return { globalTotal, campusTotal };
}

export const load: PageLoad = async ({ params, fetch, parent }) => {
	const parentData = await parent();
	const primaryCampusId = parentData.primaryCampusId ?? 1;
	const primaryCampusName = parentData.primaryCampus?.name ?? `Campus #${primaryCampusId}`;
	const slug = params.slug;

	try {
		const res = await fetch(`/api/v2/projects/${slug}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				project: null as any,
				slug,
				projectId: null as number | null,
				primaryCampusId,
				primaryCampusName,
				totals: Promise.resolve({ globalTotal: 0, campusTotal: 0 }),
				initialProjectUsers: [] as FtProjectUser[],
				error: err?.message || `Failed to load project ${slug} (${res.status})`,
				title: ['Projects', slug]
			};
		}

		const data = await res.json();
		const projectId = data?.id ?? null;

		const totals = projectId
			? fetchProjectTotals(fetch, projectId, primaryCampusId)
			: Promise.resolve({ globalTotal: 0, campusTotal: 0 });

		return {
			project: data as any,
			slug,
			projectId,
			primaryCampusId,
			primaryCampusName,
			totals,
			error: null,
			title: ['Projects', data?.name || slug],
			intraUrl: `https://projects.intra.42.fr/projects/${slug}`
		};
	} catch (err: any) {
		return {
			project: null as any,
			slug,
			projectId: null as number | null,
			primaryCampusId,
			primaryCampusName,
			totals: Promise.resolve({ globalTotal: 0, campusTotal: 0 }),
			error: err?.message || `Network error while loading project ${slug}`,
			title: ['Projects', slug],
			intraUrl: `https://projects.intra.42.fr/projects/${slug}`
		};
	}
};
