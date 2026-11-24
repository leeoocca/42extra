export { cn } from "cn";

export const PAGE_TITLE_SEPARATOR = ' › ';

export function formatPageTitle(title?: string | string[]): string {
	if (!title || (Array.isArray(title) && title.length === 0)) return '42extra';
	const titleStr = Array.isArray(title)
		? title.filter(Boolean).join(PAGE_TITLE_SEPARATOR)
		: title;
	return titleStr ? `${titleStr} :: 42extra` : '42extra';
}

/**
 * Format timestamp into clean, concise human-readable relative duration.
 * e.g. "just now", "5m ago", "2h ago", "3d ago", or "Nov 24"
 */
export function formatRelativeTime(dateInput: string | Date | number | undefined | null): string {
	if (!dateInput) return '';
	const date = new Date(dateInput);
	if (isNaN(date.getTime())) return '';

	const diffMs = Date.now() - date.getTime();
	if (diffMs < 0) {
		// Future date (e.g. event starting soon)
		const futureSec = Math.floor(Math.abs(diffMs) / 1000);
		if (futureSec < 60) return 'in 1m';
		const futureMin = Math.floor(futureSec / 60);
		if (futureMin < 60) return `in ${futureMin}m`;
		const futureHr = Math.floor(futureMin / 60);
		if (futureHr < 24) return `in ${futureHr}h`;
		const futureDay = Math.floor(futureHr / 24);
		return `in ${futureDay}d`;
	}

	const diffSec = Math.floor(diffMs / 1000);
	if (diffSec < 60) return 'just now';

	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) return `${diffMin}m ago`;

	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;

	const diffDay = Math.floor(diffHr / 24);
	if (diffDay < 7) return `${diffDay}d ago`;

	return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Format timestamp into exact human-readable date and time.
 * e.g. "Nov 24, 15:46" or "Nov 24, 2025, 15:46"
 */
export function formatActualDate(dateInput: string | Date | number | undefined | null): string {
	if (!dateInput) return '';
	const date = new Date(dateInput);
	if (isNaN(date.getTime())) return '';

	const isCurrentYear = date.getFullYear() === new Date().getFullYear();
	return date.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		...(isCurrentYear ? {} : { year: 'numeric' }),
		hour: '2-digit',
		minute: '2-digit'
	});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
