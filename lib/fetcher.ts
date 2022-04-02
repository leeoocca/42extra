import { RateLimiter } from "limiter";
import { getSession } from "next-auth/react";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 600 });

export default async function fetcher(url: string, method: string = "GET") {
	const session = await getSession();

	await limiter.removeTokens(1);

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${session.accessToken}` },
		method: method,
	});

	const data = await res.json().catch(() => null);

	// bad request excluding no teams for user
	if (!res.ok && res.status !== 404 && !url.endsWith("/teams")) {
		const error = new Error(data?.error || res.status);
		error.name = url;
		throw error;
	}

	return data;
}
