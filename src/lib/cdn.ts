/**
 * Converts a 42 CDN URL (or path) to use the local API server CDN proxy endpoint.
 *
 * Example:
 *   https://cdn.intra.42.fr/users/norminet.jpg -> /api/cdn?url=https%3A%2F%2Fcdn.intra.42.fr%2Fusers%2Fnorminet.jpg
 */
export function getCdnProxyUrl(url: string | null | undefined): string | undefined {
	if (!url) return undefined;

	// Already proxied, inline data URI, or local relative path
	if (url.startsWith('/api/cdn') || url.startsWith('data:') || url.startsWith('/')) {
		return url;
	}

	// 42 CDN URL
	if (url.includes('cdn.intra.42.fr')) {
		return `/api/cdn?url=${encodeURIComponent(url)}`;
	}

	return url;
}
