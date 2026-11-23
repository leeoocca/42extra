export { cn } from "cn";

export const PAGE_TITLE_SEPARATOR = ' › ';

export function formatPageTitle(title?: string | string[]): string {
	if (!title || (Array.isArray(title) && title.length === 0)) return '42extra';
	const titleStr = Array.isArray(title)
		? title.filter(Boolean).join(PAGE_TITLE_SEPARATOR)
		: title;
	return titleStr ? `${titleStr} :: 42extra` : '42extra';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
