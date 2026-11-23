import { proxyCdnRequest } from '#lib/server/cdn.ts';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async (event) => {
	return proxyCdnRequest(event);
};

export const HEAD: RequestHandler = async (event) => {
	const response = await proxyCdnRequest(event);
	return new Response(null, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
};
