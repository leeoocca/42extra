import { type RequestHandler } from '@sveltejs/kit';
import { fetchFtApiResponse } from '#lib/server/42-api.ts';

export const GET: RequestHandler = async (event) => {
	const path = event.params.path || '';
	const search = event.url.search;
	const endpoint = `/v2/${path}${search}`;

	const res = await fetchFtApiResponse(event, endpoint);

	// If upstream returned an error (e.g. 403 Forbidden or 404 Not Found), forward the status and error body
	// cleanly instead of crashing the server handler with a 500 error.
	if (!res.ok) {
		const errBody = await res.text().catch(() => '');
		return new Response(errBody, {
			status: res.status,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	const data = await res.json();

	const cacheControl = path === 'me' ? 'private, max-age=60' : 'private, max-age=300';

	const responseHeaders = new Headers();
	responseHeaders.set('Cache-Control', cacheControl);
	responseHeaders.set('Content-Type', 'application/json');

	// Forward pagination and total count headers if present
	const forwardedHeaders = ['x-page', 'x-per-page', 'x-total', 'link'];
	for (const h of forwardedHeaders) {
		const val = res.headers.get(h);
		if (val) {
			responseHeaders.set(h, val);
		}
	}

	return new Response(JSON.stringify(data), {
		status: res.status,
		headers: responseHeaders
	});
};
