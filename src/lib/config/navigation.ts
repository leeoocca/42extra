import type { Component } from 'svelte';
import HouseIcon from '@lucide/svelte/icons/house';
import SchoolIcon from '@lucide/svelte/icons/school';
import UsersIcon from '@lucide/svelte/icons/users';
import BuildingIcon from '@lucide/svelte/icons/building';
import EarthIcon from '@lucide/svelte/icons/earth';
import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
import ClockIcon from '@lucide/svelte/icons/clock';
import BookOpenIcon from '@lucide/svelte/icons/book-open';
import MedalIcon from '@lucide/svelte/icons/medal';
import HeartHandshakeIcon from '@lucide/svelte/icons/heart-handshake';
import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
import SearchIcon from '@lucide/svelte/icons/search';
import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock';
import CalendarCheckIcon from '@lucide/svelte/icons/calendar-check';
import StoreIcon from '@lucide/svelte/icons/store';
import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
import ShieldIcon from '@lucide/svelte/icons/shield';
import ChartColumnIcon from '@lucide/svelte/icons/chart-column';
import MapPinnedIcon from '@lucide/svelte/icons/map-pinned';
import UserRoundIcon from '@lucide/svelte/icons/user-round';
import NewspaperIcon from '@lucide/svelte/icons/newspaper';
import TerminalIcon from '@lucide/svelte/icons/terminal';

export interface SubNavItem {
	title: string;
	href: string;
	description?: string;
	badge?: string;
	icon?: Component;
}

export interface NavDomain {
	id: 'home' | 'learn' | 'peers' | 'campus' | 'network';
	title: string;
	defaultHref: string;
	icon: Component;
	badge?: string;
	items: SubNavItem[];
}

export const NAV_DOMAINS: NavDomain[] = [
	{
		id: 'home',
		title: 'Home',
		defaultHref: '/',
		icon: HouseIcon,
		items: [
			{
				title: 'Dashboard',
				href: '/',
				description: 'Overview and recent activity',
				icon: HouseIcon
			},
			{
				title: 'Calendar',
				href: '/calendar',
				description: 'Schedule, slots, evaluations & events',
				icon: CalendarCheckIcon
			},
			{
				title: 'My Profile',
				href: '/me',
				description: 'Your student profile & records',
				icon: UserRoundIcon
			}
		]
	},
	{
		id: 'learn',
		title: 'Learn',
		defaultHref: '/projects',
		icon: SchoolIcon,
		items: [
			{
				title: 'Projects',
				href: '/projects',
				description: 'Active, cursus, explore & holy graph',
				icon: FolderGit2Icon
			},
			{
				title: 'Slots',
				href: '/slots',
				description: 'Peer evaluation slots & scales',
				icon: ClockIcon
			},
			{
				title: 'Cursus',
				href: '/cursus',
				description: 'Cursuses, skills & notions',
				icon: BookOpenIcon
			},
			{
				title: 'Achievements',
				href: '/achievements',
				description: 'Badges & student milestones',
				icon: MedalIcon
			}
		]
	},
	{
		id: 'peers',
		title: 'Peers',
		defaultHref: '/friends',
		icon: UsersIcon,
		items: [
			{
				title: 'Friends',
				href: '/friends',
				description: 'Followed students & live log statuses',
				icon: HeartHandshakeIcon
			},
			{
				title: 'Clusters',
				href: '/clusters',
				description: 'Campus cluster map & active seats',
				icon: LayoutGridIcon
			},
			{
				title: 'Search',
				href: '/search',
				description: 'Find students, staff & alumni',
				icon: SearchIcon
			}
		]
	},
	{
		id: 'campus',
		title: 'Campus',
		defaultHref: '/events',
		icon: BuildingIcon,
		items: [
			{
				title: 'Feed',
				href: '/feed',
				description: 'Campus notices, news & announcements',
				icon: NewspaperIcon
			},
			{
				title: 'Events',
				href: '/events',
				description: 'Workshops, conferences, feedback & meetups',
				icon: CalendarClockIcon
			},
			{
				title: 'Shop',
				href: '/shop',
				description: 'Coalition points & campus store goodies',
				icon: StoreIcon
			},
			{
				title: 'Useful Links',
				href: '/links',
				description: 'Slack, Intranet, Discord & resources',
				icon: ExternalLinkIcon
			},
			{
				title: 'Coalitions',
				href: '/coalitions',
				description: 'Tournament standings & coalition scores',
				icon: ShieldIcon
			}
		]
	},
	{
		id: 'network',
		title: 'Network',
		defaultHref: '/campuses',
		icon: EarthIcon,
		items: [
			{
				title: 'Campuses',
				href: '/campuses',
				description: 'Explore all 42 network campuses worldwide',
				icon: MapPinnedIcon
			},
			{
				title: 'Query',
				href: '/query',
				description: 'Fetch arbitrary 42 API endpoints and inspect responses',
				icon: TerminalIcon
			}
		]
	}
];

export function getDomainForPath(pathname: string): NavDomain | undefined {
	if (pathname === '/') {
		return NAV_DOMAINS.find((d) => d.id === 'home');
	}

	for (const domain of NAV_DOMAINS) {
		for (const item of domain.items) {
			if (item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href))) {
				return domain;
			}
		}
	}

	return undefined;
}

export function getItemForPath(pathname: string): SubNavItem | undefined {
	for (const domain of NAV_DOMAINS) {
		for (const item of domain.items) {
			if (item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href))) {
				return item;
			}
		}
	}

	return undefined;
}

export function isItemActive(itemHref: string, pathname: string): boolean {
	if (itemHref === '/') {
		return pathname === '/';
	}
	return pathname === itemHref || pathname.startsWith(itemHref + '/');
}

export function isDomainActive(domain: NavDomain, pathname: string): boolean {
	if (domain.id === 'home') {
		return pathname === '/' || pathname.startsWith('/me') || pathname.startsWith('/calendar');
	}
	return domain.items.some((item) => isItemActive(item.href, pathname));
}
