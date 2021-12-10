import { LinkListNode } from "types/LinkListNode";

export function getUserNavLinks(): LinkListNode[] {
	const baseUrl = `/users/[login]`;
	return [
		{
			name: "Overview",
			href: baseUrl,
		},
		{
			name: "Projects",
			href: `${baseUrl}/projects`,
		},
		{
			name: "Quests",
			href: `${baseUrl}/quests`,
		},
		{
			name: "Achievements",
			href: `${baseUrl}/achievements`,
		},
		{
			name: "Patronages",
			href: `${baseUrl}/patronages`,
		},
		{
			name: "Partnerships",
			href: `${baseUrl}/partnerships`,
		},
		{
			name: "Apps",
			href: `${baseUrl}/apps`,
		},
	];
}

export function getProjectNavLinks(): LinkListNode[] {
	const baseUrl = `/projects/[slug]`;
	return [
		{
			name: "Overview",
			href: baseUrl,
		},
		{
			name: "Users",
			href: `${baseUrl}/users`,
		},
		{
			name: "Cursuses",
			href: `${baseUrl}/cursuses`,
		},
	];
}

export function CampusNavLinks(): LinkListNode[] {
	const baseUrl = `/campus/[id]`;
	return [
		{
			name: "Overview",
			href: baseUrl,
		},
		{
			name: "Users",
			href: `${baseUrl}/users`,
		},
	];
}

export function CursusNavLinks(): LinkListNode[] {
	const baseUrl = `/cursus/[slug]`;
	return [
		{
			name: "Overview",
			href: baseUrl,
		},
		{
			name: "Projects",
			href: `${baseUrl}/projects`,
		},
		{
			name: "Achievements",
			href: `${baseUrl}/achievements`,
		},
		{
			name: "Notions",
			href: `${baseUrl}/notions`,
		},
		{
			name: "Skills",
			href: `${baseUrl}/skills`,
		},
		{
			name: "Events",
			href: `${baseUrl}/events`,
		},
	];
}
