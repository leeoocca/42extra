<script lang="ts">
	import E from './logos/e.svelte';
	import { page } from '$app/state';
	import {
		NAV_DOMAINS,
		getDomainForPath,
		isDomainActive,
		isItemActive
	} from '#lib/config/navigation.js';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Kbd } from '#lib/components/ui/kbd/index.js';
	import { authClient } from '#lib/client.ts';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SquareArrowLeftExitIcon from '@lucide/svelte/icons/square-arrow-left-exit';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import { setMode, userPrefersMode } from 'mode-watcher';

	const activeDomain = $derived(getDomainForPath(page.url.pathname));

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = '/signin';
				}
			}
		});
	}
</script>

<header class="sticky top-0 z-40 hidden bg-background/95 backdrop-blur-md md:block">
	<!-- Primary Top Bar -->
	<div class="border-b border-border">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<!-- Left: Brand Logo & Top Level Navigation Links -->
			<div class="flex items-center gap-8">
				<a
					href="/"
					class="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
				>
					<div
						class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs"
					>
						<E class="size-4" />
					</div>
					<span class="text-base font-bold">42extra</span>
				</a>

				<!-- Top Level Navigation Items (direct click opens first submenu, no icons) -->
				<nav class="flex items-center gap-1" aria-label="Desktop Primary Navigation">
					{#each NAV_DOMAINS as domain (domain.id)}
						{@const active = isDomainActive(domain, page.url.pathname)}
						<a
							href={domain.defaultHref}
							class="flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors {active
								? 'bg-accent font-semibold text-accent-foreground'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
						>
							<span>{domain.title}</span>
						</a>
					{/each}
				</nav>
			</div>

			<!-- Right: Quick Search & User Menu -->
			<div class="flex items-center gap-3">
				<!-- Quick Command Palette Button -->
				<Button
					variant="outline"
					size="sm"
					onclick={navState.openCommand}
					class="h-9 gap-2 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
					aria-label="Search or open command palette"
				>
					<SearchIcon class="size-3.5" />
					<span>Search...</span>
					<Kbd class="ms-1.5 bg-background">⌘K</Kbd>
				</Button>

				<!-- User Profile Avatar & Dropdown (with Color Scheme Radio Selection) -->
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="icon" aria-label="User menu">
								<Avatar.Root class="size-8">
									<Avatar.Image
										src={page.data.user?.image}
										alt={page.data.user?.name ?? 'User'}
										class="object-cover"
									/>
									<Avatar.Fallback class="text-xs font-semibold">42</Avatar.Fallback>
								</Avatar.Root>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-56">
						<DropdownMenu.Label class="px-2 py-1.5">
							<div class="flex flex-col">
								<span class="text-sm font-semibold">{page.data.user?.name ?? 'Student'}</span>
								<span class="truncate text-xs text-muted-foreground">
									{page.data.user?.email ?? 'student@42.fr'}
								</span>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							{#snippet child({ props })}
								<a href="/me" class="flex w-full items-center gap-2 px-2 py-1.5 text-sm" {...props}>
									<UserRoundIcon class="size-4 text-muted-foreground" />
									<span>My Profile</span>
								</a>
							{/snippet}
						</DropdownMenu.Item>

						<!-- Theme Selection Radio Group -->
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.GroupHeading
								class="px-2 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
							>
								Theme
							</DropdownMenu.GroupHeading>
							<DropdownMenu.RadioGroup
								value={userPrefersMode.current}
								onValueChange={(val) => {
									if (val === 'light' || val === 'dark' || val === 'system') {
										setMode(val);
									}
								}}
							>
								<DropdownMenu.RadioItem value="light" class="cursor-pointer">
									<SunIcon class="me-2 size-4 text-muted-foreground" />
									<span>Light</span>
								</DropdownMenu.RadioItem>
								<DropdownMenu.RadioItem value="dark" class="cursor-pointer">
									<MoonIcon class="me-2 size-4 text-muted-foreground" />
									<span>Dark</span>
								</DropdownMenu.RadioItem>
								<DropdownMenu.RadioItem value="system" class="cursor-pointer">
									<MonitorIcon class="me-2 size-4 text-muted-foreground" />
									<span>System</span>
								</DropdownMenu.RadioItem>
							</DropdownMenu.RadioGroup>
						</DropdownMenu.Group>

						<DropdownMenu.Separator />
						<DropdownMenu.Item variant="destructive" onclick={handleSignOut} class="cursor-pointer">
							<SquareArrowLeftExitIcon class="me-2 size-4" />
							<span>Sign out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>

	<!-- Secondary Sub-Navigation Tabs (when inside a multi-item domain) -->
	{#if activeDomain && activeDomain.items.length > 1}
		<div class="border-b border-border bg-muted/20">
			<div
				class="mx-auto no-scrollbar flex h-10 max-w-7xl items-center overflow-x-auto px-4 sm:px-6 lg:px-8"
			>
				<nav class="-mb-px flex items-center space-x-1" aria-label="Sub Navigation">
					{#each activeDomain.items as item (item.href)}
						{@const active = isItemActive(item.href, page.url.pathname)}
						<a
							href={item.href}
							class="flex h-10 shrink-0 items-center border-b-2 px-3 text-sm font-medium transition-colors {active
								? 'border-primary font-semibold text-foreground'
								: 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'}"
						>
							<span>{item.title}</span>
						</a>
					{/each}
				</nav>
			</div>
		</div>
	{/if}
</header>
