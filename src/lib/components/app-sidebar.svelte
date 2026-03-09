<script lang="ts" module>
	import FrameIcon from '@lucide/svelte/icons/frame';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';

	const data = {
		navMain: [
			{
				title: 'Placeholder',
				url: '#',
				icon: SquareTerminalIcon,
				isActive: true,
				items: [
					{
						title: 'Placeholder1',
						url: '#'
					},
					{
						title: 'Placeholder2',
						url: '#'
					},
					{
						title: 'Placeholder3',
						url: '#'
					}
				]
			}
		],
		projects: [
			{
				name: 'Placeholder',
				url: '#',
				icon: FrameIcon
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavProjects from './nav-projects.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import E from './logos/e.svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<a href="/">
			<Sidebar.MenuButton
				size="lg"
				class="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			>
				<div
					class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
				>
					<E class="size-4" />
				</div>
				<div class="grid flex-1 text-start text-sm leading-tight">
					<span class="truncate font-medium">42extra</span>
					<span class="truncate text-xs">Your intra</span>
				</div>
			</Sidebar.MenuButton>
		</a>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser
			user={{
				name: page.data.session?.user?.name as string,
				email: page.data.session?.user?.email as string,
				avatar: page.data.session?.user?.image as string
			}}
		/>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
