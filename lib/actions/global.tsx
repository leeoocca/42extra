import router from "next/router";

import { BaseAction } from "kbar";
import { signOut } from "next-auth/react";
import {
	BookOpen,
	Flag,
	Github,
	MapPin,
	Home,
	Link,
	LogOut,
	Slack,
	Star,
	User,
	Users,
	Hexagon,
	Thermometer,
	Database,
} from "lucide-react";

import { ICON_SIZE } from "./constants";
import Logo from "ui/Logo";

export const globalActions: BaseAction[] = [
	{
		id: "home",
		name: "Home",
		shortcut: ["h"],
		keywords: "",
		section: "Navigation",
		icon: <Home size={ICON_SIZE} />,
		perform: () => router.push("/"),
	},
	{
		id: "me",
		name: "Your profile",
		shortcut: ["m", "e"],
		section: "Navigation",
		icon: <User size={ICON_SIZE} />,
		perform: () => {
			fetch("/api/auth/session")
				.then((r) => r.json())
				.then((r) => router.push(`/users/${r.user.login}`));
		},
	},
	{
		id: "users",
		name: "Users",
		shortcut: ["u"],
		keywords: "login",
		section: "Navigation",
		icon: <Users size={ICON_SIZE} />,
	},
	{
		id: "campus",
		name: "Campuses",
		section: "Navigation",
		icon: <MapPin size={ICON_SIZE} />,
		perform: () => router.push("/campus"),
	},
	{
		id: "coalitions",
		name: "Coalitions",
		section: "Navigation",
		icon: <Flag size={ICON_SIZE} />,
		perform: () => router.push("/coalitions"),
	},
	{
		id: "cursus",
		name: "Cursuses",
		section: "Navigation",
		icon: <BookOpen size={ICON_SIZE} />,
		perform: () => router.push("/cursus"),
	},
	{
		id: "apps",
		name: "Apps",
		section: "Navigation",
		icon: <Hexagon size={ICON_SIZE} />,
		perform: () => router.push("/apps"),
	},
	{
		id: "copyURL",
		name: "Copy URL",
		shortcut: ["c", "p"],
		section: "Tools",
		icon: <Link size={ICON_SIZE} />,
		perform: () => navigator.clipboard.writeText(window.location.href),
	},
	{
		id: "query",
		name: "Query",
		section: "Tools",
		icon: <Database size={ICON_SIZE} />,
		perform: () => router.push("/tools/query"),
	},
	{
		id: "intra",
		name: "Intranet",
		keywords: "42",
		section: "External",
		icon: <Logo width={ICON_SIZE + 4} height={ICON_SIZE + 4} />,
		perform: () =>
			window.open("https://intra.42.fr", "_blank noopener noreferrer"),
	},
	{
		id: "slack",
		name: "Slack",
		section: "External",
		icon: <Slack size={ICON_SIZE} />,
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
		icon: <Star size={ICON_SIZE} />,
		perform: () =>
			window.open(
				"https://github.com/leeoocca/awesome-42",
				"_blank noopener noreferrer"
			),
	},
	{
		id: "github",
		name: "Source code",
		shortcut: ["g", "h"],
		keywords: "github repository",
		section: "External",
		icon: <Github size={ICON_SIZE} />,
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
		icon: <Thermometer size={ICON_SIZE} />,
		perform: () => router.push("/theme"),
	},
	{
		id: "signOut",
		name: "Sign out",
		keywords: "logout exit",
		section: "You",
		icon: <LogOut size={ICON_SIZE} />,
		perform: () => signOut(),
	},
];
