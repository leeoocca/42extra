import type { PageLoad } from './$types';
import type { FtProduct } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	const primaryCampusId = parentData.primaryCampusId ?? 1;

	try {
		const res = await fetch(`/api/v2/campus/${primaryCampusId}/products?page[size]=100&sort=price`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				products: [] as FtProduct[],
				primaryCampusId,
				error: err?.message || `Failed to load campus products (${res.status})`,
				title: 'Campus Shop'
			};
		}

		const data = await res.json();
		return {
			products: (Array.isArray(data) ? data : []) as FtProduct[],
			primaryCampusId,
			error: null,
			title: 'Campus Shop',
			intraUrl: 'https://shop.intra.42.fr'
		};
	} catch (err: any) {
		return {
			products: [] as FtProduct[],
			primaryCampusId,
			error: err?.message || 'Network error while loading campus products',
			title: 'Campus Shop',
			intraUrl: 'https://shop.intra.42.fr'
		};
	}
};
