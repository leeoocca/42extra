import router from "next/router";

import { BaseAction } from "kbar";

export const userActions = (login: string, section: string): BaseAction[] => [
	{
		id: "userOverview",
		name: "Overview",
		shortcut: ["o"],
		section: section,
		perform: () => router.push(`/users/${login}`),
	},
	{
		id: "userProjects",
		name: "Projects",
		shortcut: ["p"],
		keywords: "cursus",
		section: section,
		perform: () => router.push(`/users/${login}/projects`),
	},
	{
		id: "userQuests",
		name: "Quests",
		shortcut: ["q"],
		keywords: "common core",
		section: section,
		perform: () => router.push(`/users/${login}/quests`),
	},
	{
		id: "userAchievements",
		name: "Achievements",
		shortcut: ["a"],
		section: section,
		perform: () => router.push(`/users/${login}/achievements`),
	},
	{
		id: "userLocations",
		name: "Locations",
		shortcut: ["l"],
		keywords: "cluster place",
		section: section,
		perform: () => router.push(`/users/${login}/locations`),
	},
	{
		id: "userScales",
		name: "Scales",
		keywords: "evaluations",
		section: section,
		perform: () => router.push(`/users/${login}/scales`),
	},
	{
		id: "userPatronages",
		name: "Patronages",
		section: section,
		perform: () => router.push(`/users/${login}/patronages`),
	},
	{
		id: "userPartnerships",
		name: "Partnerships",
		keywords: "company companies",
		section: section,
		perform: () => router.push(`/users/${login}/partnerships`),
	},
	{
		id: "userApps",
		name: "Apps",
		section: section,
		perform: () => router.push(`/users/${login}/apps`),
	},
];
