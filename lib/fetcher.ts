import { RateLimiter } from "limiter";
import { getSession } from "next-auth/react";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 505 });

async function fetcher(url: string) {
	const session = await getSession();

	await limiter.removeTokens(1);

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${session.accessToken}` },
	});

	return await res.json();
}

export default fetcher;
