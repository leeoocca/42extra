import type { PageLoad } from './$types';
import type { FtProduct } from '#lib/schemas/42.js';

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id;

	try {
		const res = await fetch(`/api/v2/products/${id}`);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			return {
				product: null as any,
				id,
				error: err?.message || `Failed to load product ${id} (${res.status})`,
				title: ['Shop', id]
			};
		}

		const data = await res.json();
		return {
			product: data as FtProduct,
			id,
			error: null,
			title: ['Shop', data?.name || id],
			intraUrl: 'https://profile.intra.42.fr/shop'
		};
	} catch (err: any) {
		return {
			product: null as any,
			id,
			error: err?.message || `Network error while loading product ${id}`,
			title: ['Shop', id],
			intraUrl: 'https://profile.intra.42.fr/shop'
		};
	}
};
