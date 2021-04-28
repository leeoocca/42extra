import { LinkListNode } from "@/types/LinkListNode";

export function getUserNavLinks(login: string) {
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
			name: "Apps",
			href: baseUrl + "/apps",
		},
	];

	return navLinks;
}
