import { RateLimiter } from "limiter";

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 505 });

async function fetcher(url: string) {
	await limiter.removeTokens(1);
	return fetch(url).then((r) => r.json());
}

export default fetcher;
