import type { PageLoad } from './$types';
import type { FtCursus } from '#lib/schemas/42.js';

export interface CursusProjectItem {
	id: number;
	name: string;
	slug: string;
	difficulty: number | null;
	exam: boolean;
	parent?: {
		id: number;
		name: string;
		slug: string;
	} | null;
	project_sessions?: Array<{
		estimate_time?: string | null;
		difficulty?: number | null;
		description?: string | null;
		solo?: boolean | null;
	}>;
}

export interface CursusProjectsPayload {
	projects: CursusProjectItem[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
}

async function fetchCursusProjects(
	fetchFn: typeof fetch,
	slug: string,
	pageNum: number,
	pageSize: number
): Promise<CursusProjectsPayload> {
	let projects: CursusProjectItem[] = [];
	let total = 0;
	try {
		const projectsRes = await fetchFn(
			`/api/v2/cursus/${slug}/projects?page[number]=${pageNum}&page[size]=${pageSize}&sort=name`
		);
		if (projectsRes.ok) {
			projects = await projectsRes.json();
			const totalHeader = projectsRes.headers.get('x-total');
			total = totalHeader ? parseInt(totalHeader, 10) || projects.length : projects.length;
		}
	} catch (e) {
		console.warn(`Failed to load projects for cursus ${slug}:`, e);
	}
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	return {
		projects,
		pagination: { page: pageNum, pageSize, total, totalPages }
	};
}

export const load: PageLoad = async ({ params, url, fetch }) => {
	const slug = params.slug;
	const pageNum = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
	const pageSize = 30;

	try {
		const cursusRes = await fetch(`/api/v2/cursus/${slug}`);

		if (!cursusRes.ok) {
			const err = await cursusRes.json().catch(() => null);
			return {
				cursus: null as FtCursus | null,
				projectsData: Promise.resolve<CursusProjectsPayload>({
					projects: [],
					pagination: { page: 1, pageSize, total: 0, totalPages: 1 }
				}),
				slug,
				error: err?.message || `Failed to load cursus ${slug} (${cursusRes.status})`,
				title: ['Cursus', slug]
			};
		}

		const cursus = (await cursusRes.json()) as FtCursus;

		return {
			cursus,
			projectsData: fetchCursusProjects(fetch, slug, pageNum, pageSize),
			slug,
			error: null,
			title: ['Cursus', cursus?.name || slug]
		};
	} catch (err: any) {
		return {
			cursus: null as FtCursus | null,
			projectsData: Promise.resolve<CursusProjectsPayload>({
				projects: [],
				pagination: { page: 1, pageSize, total: 0, totalPages: 1 }
			}),
			slug,
			error: err?.message || `Network error while loading cursus ${slug}`,
			title: ['Cursus', slug]
		};
	}
};
