/**
 * Resolves the corresponding 42 Intranet URL from the page load data.
 * The intraUrl is explicitly provided by the active route's load function (+page.ts).
 * Returns null if no specific intranet page is associated with the active page.
 */
export function getIntraUrl(_pathname?: string, data?: any): string | null {
	if (data?.intraUrl) {
		return data.intraUrl;
	}
	return null;
}
