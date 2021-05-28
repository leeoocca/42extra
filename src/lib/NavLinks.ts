import { LinkListNode } from "@/types/LinkListNode";

export function getUserNavLinks() {
	const baseUrl = "/u/[login]";

	let navLinks: LinkListNode[] = [
		{
			name: "Overview",
			href: baseUrl,
		},
		{
			name: "Projects",
			href: baseUrl + "/projects",
		},
		{
			name: "Quests",
			href: baseUrl + "/quests",
		},
		{
			name: "Achievements",
			href: baseUrl + "/achievements",
		},
		{
			name: "Patronages",
			href: baseUrl + "/patronages",
		},
		{
			name: "Partnerships",
			href: baseUrl + "/partnerships",
		},
		{
			name: "Apps",
			href: baseUrl + "/apps",
		},
	];

	return navLinks;
}

export function getProjectNavLinks() {
	const baseUrl = "/p/[slug]";

	let navLinks: LinkListNode[] = [
		{
			name: "Overview",
			href: baseUrl,
		},
		{
			name: "Users",
			href: baseUrl + "/users",
		},
		{
			name: "Cursuses",
			href: baseUrl + "/cursuses",
		},
	];

	return navLinks;
}
