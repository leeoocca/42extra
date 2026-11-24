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
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import { invalidateAll } from '$app/navigation';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SquareArrowLeftExitIcon from '@lucide/svelte/icons/square-arrow-left-exit';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import { setMode, userPrefersMode } from 'mode-watcher';
	import { getIntraUrl } from '#lib/intra.js';

	const activeDomain = $derived(getDomainForPath(page.url.pathname));
	const currentIntraUrl = $derived(getIntraUrl(page.url.pathname, page.data));

	let isRefreshing = $state(false);

	async function handleRefreshData() {
		isRefreshing = true;
		try {
			await invalidateAll();
			if (navState.onRefresh) {
				await navState.onRefresh();
			}
		} catch (e) {
			console.error('Data refresh error:', e);
		} finally {
			setTimeout(() => {
				isRefreshing = false;
			}, 300);
		}
	}

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
			<div class="flex items-center gap-2 sm:gap-2.5">
				<!-- See this page on Intra Link (to the left of search bar) -->
				{#if currentIntraUrl}
					<Button
						href={currentIntraUrl}
						target="_blank"
						rel="noreferrer"
						variant="outline"
						size="sm"
						class="h-9 bg-muted/30 px-2.5 text-xs text-muted-foreground hover:text-foreground"
						title="See this page on 42 Intra"
					>
						<ExternalLinkIcon class="size-3.5" />
						<span>Intra</span>
					</Button>
				{:else}
					<Button
						variant="outline"
						size="sm"
						disabled
						class="h-9 cursor-not-allowed bg-muted/10 px-2.5 text-xs text-muted-foreground/40 opacity-50"
						title="No 42 Intra page associated with this route"
					>
						<ExternalLinkIcon class="size-3.5" />
						<span>Intra</span>
					</Button>
				{/if}

				<!-- Data Refresh Button (on top) -->
				<Button
					variant="outline"
					size="sm"
					onclick={handleRefreshData}
					disabled={isRefreshing}
					class="h-9 bg-muted/30 px-2.5 text-xs text-muted-foreground hover:text-foreground"
					title="Refresh data"
					aria-label="Refresh data"
				>
					<RefreshCwIcon class="size-3.5 {isRefreshing ? 'animate-spin text-primary' : ''}" />
				</Button>

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
							<Button
								{...props}
								variant="ghost"
								size="icon"
								class="size-8 overflow-hidden rounded-full p-0 ring-offset-background hover:ring-2 hover:ring-ring hover:ring-offset-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
								aria-label="User menu"
							>
								<Avatar.Root class="size-8">
									<Avatar.Image
										src={getCdnProxyUrl(page.data.user?.image)}
										alt={page.data.user?.name ?? 'User'}
										class="object-cover"
										referrerpolicy="no-referrer"
									/>
									<Avatar.Fallback class="text-xs font-semibold">
										{page.data.user?.name?.slice(0, 2)?.toUpperCase() ?? '42'}
									</Avatar.Fallback>
								</Avatar.Root>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-60">
						<DropdownMenu.Item>
							{#snippet child({ props })}
								<a href="/me" class="flex items-center gap-2.5" {...props}>
									<Avatar.Root class="size-9">
										<Avatar.Image
											src={getCdnProxyUrl(page.data.user?.image)}
											alt={page.data.user?.name ?? 'User'}
											class="object-cover"
											referrerpolicy="no-referrer"
										/>
										<Avatar.Fallback class="text-xs font-semibold">
											{page.data.user?.name?.slice(0, 2)?.toUpperCase() ?? '42'}
										</Avatar.Fallback>
									</Avatar.Root>
									<div class="flex min-w-0 flex-1 flex-col">
										<span class="truncate text-sm font-semibold">
											{page.data.user?.name ?? 'Student'}
										</span>
										<span class="truncate text-xs font-normal text-muted-foreground">
											{page.data.user?.email ?? 'student@42.fr'}
										</span>
									</div>
								</a>
							{/snippet}
						</DropdownMenu.Item>

						<!-- Theme Selection Radio Group -->
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.GroupHeading>Theme</DropdownMenu.GroupHeading>
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
