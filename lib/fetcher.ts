import { RateLimiter } from "limiter";
import { getSession } from "next-auth/react";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 505 });

export default async function fetcher(url: string) {
	const session = await getSession();

	await limiter.removeTokens(1);

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${session.accessToken}` },
	});

	if (!res.ok) {
		throw { desc: res.statusText, status: res.status };
	}

	return await res.json();
}
