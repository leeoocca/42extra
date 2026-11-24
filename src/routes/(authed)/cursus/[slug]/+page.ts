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

export const load: PageLoad = async ({ params, url, fetch }) => {
	const slug = params.slug;
	const pageNum = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
	const pageSize = 30;

	try {
		const [cursusRes, projectsRes] = await Promise.all([
			fetch(`/api/v2/cursus/${slug}`),
			fetch(
				`/api/v2/cursus/${slug}/projects?page[number]=${pageNum}&page[size]=${pageSize}&sort=name`
			)
		]);

		if (!cursusRes.ok) {
			const err = await cursusRes.json().catch(() => null);
			return {
				cursus: null as FtCursus | null,
				projects: [] as CursusProjectItem[],
				pagination: { page: 1, total: 0, totalPages: 1 },
				slug,
				error: err?.message || `Failed to load cursus ${slug} (${cursusRes.status})`,
				title: ['Cursus', slug]
			};
		}

		const cursus = (await cursusRes.json()) as FtCursus;

		let projects: CursusProjectItem[] = [];
		let total = 0;

		if (projectsRes.ok) {
			projects = await projectsRes.json();
			const totalHeader = projectsRes.headers.get('x-total');
			if (totalHeader) {
				total = parseInt(totalHeader, 10) || projects.length;
			} else {
				total = projects.length;
			}
		}

		const totalPages = Math.max(1, Math.ceil(total / pageSize));

		return {
			cursus,
			projects,
			pagination: {
				page: pageNum,
				pageSize,
				total,
				totalPages
			},
			slug,
			error: null,
			title: ['Cursus', cursus?.name || slug]
		};
	} catch (err: any) {
		return {
			cursus: null as FtCursus | null,
			projects: [] as CursusProjectItem[],
			pagination: { page: 1, pageSize: 30, total: 0, totalPages: 1 },
			slug,
			error: err?.message || `Network error while loading cursus ${slug}`,
			title: ['Cursus', slug]
		};
	}
};
