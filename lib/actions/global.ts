import { BaseAction } from "kbar";
import { signOut } from "next-auth/client";
import router from "next/router";

export const globalActions: BaseAction[] = [
	{
		id: "home",
		name: "Home",
		shortcut: ["h"],
		keywords: "",
		section: "Navigation",
		perform: () => router.push("/"),
	},
	{
		id: "users",
		name: "Users",
		shortcut: ["u"],
		keywords: "login",
		section: "Navigation",
		perform: () => router.push("/users"),
	},
	{
		id: "campus",
		name: "Campuses",
		section: "Navigation",
		perform: () => router.push("/campus"),
	},
	{
		id: "coalitions",
		name: "Coalitions",
		section: "Navigation",
		perform: () => router.push("/coalitions"),
	},
	{
		id: "cursus",
		name: "Cursuses",
		section: "Navigation",
		perform: () => router.push("/cursus"),
	},
	{
		id: "apps",
		name: "Apps",
		section: "Navigation",
		perform: () => router.push("/apps"),
	},
	{
		id: "intra",
		name: "42 Intranet",
		section: "External",
		perform: () =>
			window.open("https://intra.42.fr", "_blank noopener noreferrer"),
	},
	{
		id: "slack",
		name: "Slack",
		section: "External",
		perform: () =>
			window.open(
				"https://42born2code.slack.com",
				"_blank noopener noreferrer"
			),
	},
	{
		id: "awesome",
		name: "Awesome 42",
		shortcut: ["a", "w"],
		keywords: "list resources",
		section: "External",
		perform: () =>
			window.open(
				"https://github.com/leeoocca/awesome-42",
				"_blank noopener noreferrer"
			),
	},
	{
		id: "github",
		name: "GitHub",
		shortcut: ["g", "h"],
		keywords: "repository source code",
		section: "External",
		perform: () =>
			window.open(
				"https://github.com/leeoocca/42extra",
				"_blank noopener noreferrer"
			),
	},
	{
		id: "theme",
		name: "Theme",
		shortcut: ["t"],
		section: "You",
		perform: () => router.push("/theme"),
	},
	{
		id: "signOut",
		name: "Sign out",
		keywords: "logout",
		section: "You",
		perform: () => signOut(),
	},
];
