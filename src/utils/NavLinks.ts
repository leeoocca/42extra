import { LinkListNode } from "@interfaces/LinkListNode";

export function getUserNavLinks(login: string) {
	const baseUrl = "/users/[login]";

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
			name: "Apps",
			href: baseUrl + "/apps",
		},
	];

	return navLinks;
}
