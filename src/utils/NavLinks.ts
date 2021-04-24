import { LinkListNode } from "@interfaces/LinkListNode";

export function getUserNavLinks(login: string, active: number) {
	const baseUrl = "/users/" + login;

	let navLinks: LinkListNode[] = [
		{
			name: "Overview",
			uri: baseUrl,
		},
		{
			name: "Projects",
			uri: baseUrl + "/projects",
		},
		{
			name: "Quests",
			uri: baseUrl + "/quests",
		},
		{
			name: "Achievements",
			uri: baseUrl + "/achievements",
		},
		{
			name: "Apps",
			uri: baseUrl + "/apps",
		},
	];

	navLinks[active].isActive = true;

	return navLinks;
}
