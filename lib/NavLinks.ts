import router from "next/router";
import { LinkListNode } from "types/LinkListNode";

export function getUserNavLinks() {
	const { login } = router.query;
	const baseUrl = `/users/${login}`;

	let navLinks: LinkListNode[] = [
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

	return navLinks;
}

export function getProjectNavLinks() {
	const { slug } = router.query;
	const baseUrl = `/projects/${slug}`;

	let navLinks: LinkListNode[] = [
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

	return navLinks;
}

export function CampusNavLinks() {
	const { id } = router.query;
	const baseUrl = `/campus/${id}`;

	const navLinks: LinkListNode[] = [
		{
			name: "Overview",
			href: baseUrl,
		},
		{
			name: "Users",
			href: `${baseUrl}/users`,
		},
	];

	return navLinks;
}

export function CursusNavLinks() {
	const { slug } = router.query;
	const baseUrl = `/cursus/${slug}`;

	const navLinks: LinkListNode[] = [
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

	return navLinks;
}
