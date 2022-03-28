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

	if (!res.ok) {
		throw res;
	}

	return method === "GET" ? await res.json() : res;
}
