<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import UsersIcon from '@lucide/svelte/icons/users';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import SearchIcon from '@lucide/svelte/icons/search';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import XIcon from '@lucide/svelte/icons/x';
	import type { PageData } from './$types';
	import type { FtCampus } from '#lib/schemas/42.js';
	import { onMount, onDestroy } from 'svelte';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let filterStatus = $state<'all' | 'active' | 'public'>('all');
	let sortBy = $state<'name' | 'students' | 'id'>('name');
	let refreshError = $state<string | null>(null);
	let customCampuses = $state<FtCampus[] | null>(null);

	let activeCampuses = $derived(customCampuses ?? data.campuses ?? []);

	async function handleRefresh() {
		refreshError = null;
		try {
			const res = await fetch('/api/v2/campus?page[size]=100&sort=name');
			if (!res.ok) {
				const err = await res.json().catch(() => null);
				throw new Error(err?.message || `Refresh failed (${res.status})`);
			}
			const json = await res.json();
			const list = Array.isArray(json) ? json : (json.campuses ?? []);
			customCampuses = list as FtCampus[];
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : 'Failed to refresh campus directory from 42 API';
			refreshError = message;
		}
	}

	onMount(() => {
		navState.onRefresh = handleRefresh;
	});

	onDestroy(() => {
		if (navState.onRefresh === handleRefresh) {
			navState.onRefresh = null;
		}
	});

	let filteredCampuses = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		let list = activeCampuses.filter((c) => {
			if (filterStatus === 'active' && !c.active) return false;
			if (filterStatus === 'public' && !c.public) return false;

			if (!q) return true;

			const nameMatch = c.name?.toLowerCase().includes(q);
			const cityMatch = c.city?.toLowerCase().includes(q);
			const countryMatch = c.country?.toLowerCase().includes(q);
			const tzMatch = c.time_zone?.toLowerCase().includes(q);
			const idMatch =
				c.id?.toString() === q || (q.startsWith('#') && c.id?.toString() === q.slice(1));

			return nameMatch || cityMatch || countryMatch || tzMatch || idMatch;
		});

		return list.sort((a, b) => {
			if (sortBy === 'students') {
				return (b.users_count || 0) - (a.users_count || 0);
			}
			if (sortBy === 'id') {
				return (a.id || 0) - (b.id || 0);
			}
			return (a.name || '').localeCompare(b.name || '');
		});
	});

	let totalStudents = $derived(activeCampuses.reduce((acc, c) => acc + (c.users_count || 0), 0));

	let activeCount = $derived(activeCampuses.filter((c) => c.active).length);

	let publicCount = $derived(activeCampuses.filter((c) => c.public).length);
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Campuses</h1>
		</div>
	</div>

	<!-- System Banner / Alerts -->
	{#if data.error || refreshError}
		<div
			class="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
			role="alert"
		>
			<CircleAlertIcon class="mt-0.5 size-4 shrink-0" />
			<div class="flex-1">
				<p class="font-medium">Failed to update campus directory</p>
				<p class="mt-0.5 text-xs text-destructive/90">{refreshError || data.error}</p>
			</div>
		</div>
	{/if}

	<!-- Compact Network Metrics Toolbar -->
	<div
		class="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/60 p-3 text-xs text-muted-foreground"
	>
		<div
			class="flex items-center gap-1.5 pr-2 font-medium text-foreground sm:border-r sm:border-border/60"
		>
			<BuildingIcon class="size-3.5 text-foreground/80" />
			<span>Network Summary</span>
		</div>
		<div class="flex flex-wrap items-center gap-x-4 gap-y-1">
			<span>
				Total: <strong class="font-semibold text-foreground tabular-nums">
					{activeCampuses.length}
				</strong>
			</span>
			<span class="text-border">•</span>
			<span>
				Active: <strong class="font-semibold text-foreground tabular-nums">{activeCount}</strong>
			</span>
			<span class="text-border">•</span>
			<span>
				Students: <strong class="font-semibold text-foreground tabular-nums">
					{totalStudents.toLocaleString()}
				</strong>
			</span>
			{#if activeCampuses.length > 0}
				<span class="text-border">•</span>
				<span>
					Public: <strong class="font-semibold text-foreground tabular-nums">{publicCount}</strong>
				</span>
			{/if}
		</div>
	</div>

	<!-- Controls Bar: Search, Filters & Sorting -->
	<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
		<!-- Search Input with Clear Action -->
		<div class="relative max-w-lg flex-1">
			<SearchIcon
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				type="search"
				placeholder="Search by campus name, city, country, or ID..."
				bind:value={searchQuery}
				class="h-9 pr-9 pl-9 text-sm"
				aria-label="Search campuses"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => (searchQuery = '')}
					class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
					aria-label="Clear search query"
				>
					<XIcon class="size-3.5" />
				</button>
			{/if}
		</div>

		<!-- Status Filter Pills & Sort Selector -->
		<div class="flex flex-wrap items-center gap-2">
			<!-- Filter Pills -->
			<div
				class="inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-0.5"
			>
				<Button
					variant={filterStatus === 'all' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (filterStatus = 'all')}
				>
					All ({activeCampuses.length})
				</Button>
				<Button
					variant={filterStatus === 'active' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (filterStatus = 'active')}
				>
					Active ({activeCount})
				</Button>
				<Button
					variant={filterStatus === 'public' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (filterStatus = 'public')}
				>
					Public ({publicCount})
				</Button>
			</div>

			<!-- Sort Selector -->
			<div
				class="inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-0.5"
			>
				<Button
					variant={sortBy === 'name' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (sortBy = 'name')}
				>
					Name
				</Button>
				<Button
					variant={sortBy === 'students' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (sortBy = 'students')}
				>
					Students
				</Button>
				<Button
					variant={sortBy === 'id' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (sortBy = 'id')}
				>
					ID
				</Button>
			</div>
		</div>
	</div>

	<!-- Campus Directory Grid -->
	{#if filteredCampuses.length > 0}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredCampuses as campus (campus.id)}
				<article
					class="flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20"
				>
					<div class="space-y-3">
						<!-- Card Top: Name, Location & Status -->
						<div class="flex items-start justify-between gap-2">
							<div class="min-w-0 flex-1">
								<h2
									class="truncate text-base font-bold tracking-tight text-foreground"
									title={campus.name}
								>
									{campus.name}
								</h2>
								<div class="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
									<MapPinIcon class="size-3 shrink-0 text-muted-foreground/70" />
									<span class="truncate">
										{[campus.city, campus.country].filter(Boolean).join(', ') || 'Global'}
									</span>
								</div>
							</div>
							<div class="shrink-0">
								{#if campus.active}
									<Badge
										variant="outline"
										class="gap-1 border-border/80 text-xs font-medium text-foreground"
									>
										<span class="size-1.5 rounded-full bg-emerald-500"></span>
										<span>Active</span>
									</Badge>
								{:else}
									<Badge variant="outline" class="text-xs font-medium text-muted-foreground/70">
										Inactive
									</Badge>
								{/if}
							</div>
						</div>

						<!-- Details Rows -->
						<div class="space-y-1.5 border-t border-border/60 pt-2 text-xs text-muted-foreground">
							{#if campus.users_count !== undefined}
								<div class="flex items-center justify-between">
									<span class="flex items-center gap-1.5">
										<UsersIcon class="size-3 text-muted-foreground/70" />
										<span>Students</span>
									</span>
									<span class="font-semibold text-foreground tabular-nums">
										{campus.users_count.toLocaleString()}
									</span>
								</div>
							{/if}

							{#if campus.time_zone}
								<div class="flex items-center justify-between">
									<span class="flex items-center gap-1.5">
										<ClockIcon class="size-3 text-muted-foreground/70" />
										<span>Timezone</span>
									</span>
									<span
										class="max-w-[170px] truncate text-xs tabular-nums"
										title={campus.time_zone}
									>
										{campus.time_zone}
									</span>
								</div>
							{/if}

							{#if campus.email_extension}
								<div class="flex items-center justify-between">
									<span>Email</span>
									<span class="max-w-[170px] truncate text-xs text-muted-foreground">
										@{campus.email_extension}
									</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Card Footer: Website Link and Campus ID -->
					<div
						class="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs"
					>
						{#if campus.website}
							<a
								href={campus.website.startsWith('http')
									? campus.website
									: `https://${campus.website}`}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:underline"
							>
								<span>Website</span>
								<ExternalLinkIcon class="size-3" />
							</a>
						{:else}
							<span class="text-muted-foreground/60">No website</span>
						{/if}
						<span class="text-xs text-muted-foreground tabular-nums">ID #{campus.id}</span>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div
			class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-12 text-center"
		>
			<BuildingIcon class="mb-3 size-10 text-muted-foreground/40" />
			<h3 class="text-base font-semibold text-foreground">No campuses found</h3>
			<p class="mt-1 max-w-sm text-sm text-muted-foreground">
				{#if searchQuery}
					No campus matches "<span class="font-medium text-foreground">{searchQuery}</span>". Try
					searching for another name, city, country, or ID.
				{:else}
					No campuses match the selected filter criteria.
				{/if}
			</p>
			<Button
				variant="outline"
				size="sm"
				class="mt-4 text-xs"
				onclick={() => {
					searchQuery = '';
					filterStatus = 'all';
				}}
			>
				Reset filters
			</Button>
		</div>
	{/if}
</div>
