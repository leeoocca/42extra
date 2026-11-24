/**
 * Converts a 42 CDN URL (or path) to use the local API server CDN proxy endpoint.
 * Safely handles strings, object structures (e.g. { link, versions }), null, and undefined.
 *
 * Example:
 *   https://cdn.intra.42.fr/users/norminet.jpg -> /api/cdn?url=https%3A%2F%2Fcdn.intra.42.fr%2Fusers%2Fnorminet.jpg
 */
export function getCdnProxyUrl(url: unknown): string | undefined {
	if (!url) return undefined;

	// If url is an object (e.g. 42 image object { link, versions }), extract the best string candidate
	let targetUrl: string | undefined;
	if (typeof url === 'string') {
		targetUrl = url;
	} else if (typeof url === 'object' && url !== null) {
		const obj = url as Record<string, any>;
		targetUrl =
			(typeof obj.link === 'string' && obj.link) ||
			(typeof obj.url === 'string' && obj.url) ||
			(typeof obj.versions?.medium === 'string' && obj.versions.medium) ||
			(typeof obj.versions?.large === 'string' && obj.versions.large) ||
			(typeof obj.versions?.small === 'string' && obj.versions.small) ||
			undefined;
	}

	if (!targetUrl || typeof targetUrl !== 'string') {
		return undefined;
	}

	// Already proxied, inline data URI, or local relative path
	if (targetUrl.startsWith('/api/cdn') || targetUrl.startsWith('data:') || targetUrl.startsWith('/')) {
		return targetUrl;
	}

	// 42 CDN URL
	if (targetUrl.includes('cdn.intra.42.fr')) {
		return `/api/cdn?url=${encodeURIComponent(targetUrl)}`;
	}

	return targetUrl;
}
