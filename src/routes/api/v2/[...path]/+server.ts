import { type RequestHandler } from '@sveltejs/kit';
import { fetchFtApi } from '#lib/server/42-api.ts';

export const GET: RequestHandler = async (event) => {
	const path = event.params.path || '';
	const search = event.url.search;
	const endpoint = `/v2/${path}${search}`;

	const data = await fetchFtApi(event, endpoint);

	const cacheControl = path === 'me' ? 'private, max-age=60' : 'private, max-age=300';

	return Response.json(data, {
		headers: {
			'Cache-Control': cacheControl
		}
	});
};
