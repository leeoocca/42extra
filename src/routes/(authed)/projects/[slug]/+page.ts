import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const slug = params.slug;

	try {
		const res = await fetch(`/api/v2/projects/${slug}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				project: null as any,
				slug,
				error: err?.message || `Failed to load project ${slug} (${res.status})`,
				title: ['Projects', slug]
			};
		}

		const data = await res.json();
		return {
			project: data,
			slug,
			error: null,
			title: ['Projects', data?.name || slug],
			intraUrl: `https://projects.intra.42.fr/projects/${slug}`
		};
	} catch (err: any) {
		return {
			project: null as any,
			slug,
			error: err?.message || `Network error while loading project ${slug}`,
			title: ['Projects', slug],
			intraUrl: `https://projects.intra.42.fr/projects/${slug}`
		};
	}
};
