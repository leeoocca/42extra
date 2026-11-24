<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import type { PageData } from './$types';
	import type { FtLocation, FtCluster } from '#lib/schemas/42.js';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import { groupLocationsByCluster, getCampusClusterConfig } from '#lib/config/clusters.js';
	import { onMount } from 'svelte';
	import { formatTimeSince } from '#lib/time.ts';

	let { data }: { data: PageData } = $props();

	let customCampusId = $state<number | null>(null);
	let selectedCampusId = $derived(customCampusId ?? data.initialCampusId);
	let locations = $state<FtLocation[]>([]);
	let clusters = $state<FtCluster[]>([]);
	let isLoading = $state(false);
	let errorMsg = $state<string | null>(null);
	let searchQuery = $state('');

	// Recent user history state
	let recentLocations = $state<FtLocation[]>([]);
	let recentPage = $state(1);
	let isLoadingRecent = $state(false);
	let isLoadingMoreRecent = $state(false);
	let hasRequestedRecent = $state(false);
	let hasMoreRecent = $state(true);
	let recentError = $state<string | null>(null);

	function formatHost(host: string): string[] {
		if (!host) return [];
		const trimmed = host.trim();
		if (trimmed.length === 6) {
			return [trimmed.slice(0, 2), trimmed.slice(2, 4), trimmed.slice(4, 6)];
		}
		return [trimmed];
	}

	async function fetchRecentLocationsPage(campusId: number, pageNum: number) {
		const res = await fetch(
			`/api/v2/campus/${campusId}/locations?sort=-begin_at&page[number]=${pageNum}&page[size]=100`
		);
		if (!res.ok) {
			const err = await res.json().catch(() => null);
			throw new Error(err?.message || `Failed to fetch recent history (${res.status})`);
		}
		const json = await res.json();
		return Array.isArray(json) ? (json as FtLocation[]) : [];
	}

	async function loadCampusData(campusId: number) {
		isLoading = true;
		errorMsg = null;
		recentError = null;
		recentLocations = [];
		recentPage = 1;
		hasRequestedRecent = false;
		hasMoreRecent = true;

		try {
			// Fetch active locations dynamically for the active campus
			const locPromise = fetch(
				`/api/v2/campus/${campusId}/locations?filter[active]=true&page[size]=100`
			);
			// Also fetch /v2/clusters filtered by campus for grouping lookup
			const clusterPromise = fetch(`/api/v2/clusters?filter[campus_id]=${campusId}&page[size]=100`);

			const [locRes, clusterRes] = await Promise.all([locPromise, clusterPromise]);

			if (locRes.ok) {
				const json = await locRes.json();
				locations = Array.isArray(json) ? json : [];
			} else {
				const err = await locRes.json().catch(() => null);
				throw new Error(err?.message || `Failed to fetch cluster workstations (${locRes.status})`);
			}

			if (clusterRes.ok) {
				const cJson = await clusterRes.json();
				clusters = Array.isArray(cJson) ? cJson : [];
			} else {
				clusters = [];
			}
		} catch (err: any) {
			errorMsg = err?.message || 'Error loading cluster locations';
		} finally {
			isLoading = false;
		}
	}

	async function loadInitialRecent() {
		hasRequestedRecent = true;
		isLoadingRecent = true;
		recentError = null;

		try {
			const items = await fetchRecentLocationsPage(selectedCampusId, 1);
			recentLocations = items;
			recentPage = 1;
			if (items.length < 100) {
				hasMoreRecent = false;
			}
		} catch (err: any) {
			recentError = err?.message || 'Failed to load recent campus activity';
		} finally {
			isLoadingRecent = false;
		}
	}

	async function loadMoreRecent() {
		if (isLoadingMoreRecent || !hasMoreRecent) return;
		isLoadingMoreRecent = true;
		recentError = null;

		try {
			const nextPage = recentPage + 1;
			const newItems = await fetchRecentLocationsPage(selectedCampusId, nextPage);
			if (newItems.length === 0) {
				hasMoreRecent = false;
			} else {
				recentLocations = [...recentLocations, ...newItems];
				recentPage = nextPage;
				if (newItems.length < 100) {
					hasMoreRecent = false;
				}
			}
		} catch (err: any) {
			recentError = err?.message || 'Failed to load more recent campus users';
		} finally {
			isLoadingMoreRecent = false;
		}
	}

	// Unique recent users: deduplicate by user id (preserving chronological order: latest first)
	let uniqueRecentUsers = $derived.by(() => {
		const seenUserIds = new Set<number>();
		const result: {
			location: FtLocation;
			user: NonNullable<FtLocation['user']>;
			avatarUrl: string | null;
		}[] = [];

		for (const loc of recentLocations) {
			if (!loc.user || !loc.user.id) continue;
			if (seenUserIds.has(loc.user.id)) continue;
			seenUserIds.add(loc.user.id);

			const rawImg = loc.user.image?.link ?? loc.user.image?.versions?.small;
			const avatarUrl = rawImg ? (getCdnProxyUrl(rawImg) ?? null) : null;

			result.push({
				location: loc,
				user: loc.user,
				avatarUrl
			});
		}

		return result;
	});

	onMount(() => {
		loadCampusData(selectedCampusId);
	});

	$effect(() => {
		navState.onRefresh = () => loadCampusData(selectedCampusId);
		return () => {
			navState.onRefresh = null;
		};
	});

	function handleCampusChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const id = Number(target.value);
		if (id && id !== selectedCampusId) {
			customCampusId = id;
			loadCampusData(id);
		}
	}

	let currentCampusName = $derived.by(() => {
		const campus = data.campuses.find((c) => c.id === selectedCampusId);
		return campus?.name ?? `Campus #${selectedCampusId}`;
	});

	let campusConfig = $derived.by(() => {
		return getCampusClusterConfig(selectedCampusId, currentCampusName);
	});

	// Filter locations
	let filteredLocations = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return locations;

		return locations.filter((loc) => {
			const hostMatch = loc.host?.toLowerCase().includes(q);
			const loginMatch = loc.user?.login?.toLowerCase().includes(q);
			const nameMatch = loc.user?.displayname?.toLowerCase().includes(q);
			return hostMatch || loginMatch || nameMatch;
		});
	});

	// Group locations by cluster, sorted by prefix if available, then by name
	let clusterGroups = $derived.by(() => {
		return groupLocationsByCluster(filteredLocations, campusConfig, clusters);
	});
</script>

<div class="space-y-6">
	<!-- Top Bar -->
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Clusters</h1>
				<Badge variant="outline" class="px-2 py-0.5 text-xs">
					{currentCampusName}
				</Badge>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<!-- Campus selector -->
			<div class="relative">
				<select
					value={selectedCampusId}
					onchange={handleCampusChange}
					class="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
				>
					{#each data.campuses as c}
						<option value={c.id}>
							{c.name}
							{c.id === data.initialCampusId ? '(Primary)' : ''}
						</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Search & Summary bar -->
	<div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
		<div class="relative w-full sm:w-72">
			<SearchIcon class="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter host or login..."
				bind:value={searchQuery}
				class="h-8 pl-8 text-xs"
			/>
		</div>

		<div class="flex items-center gap-2 text-xs text-muted-foreground">
			<span class="flex items-center gap-1">
				<MonitorIcon class="h-3.5 w-3.5" />
				{locations.length} occupied workstation{locations.length === 1 ? '' : 's'}
			</span>
			<span>&bull;</span>
			<span>{clusterGroups.length} active zone{clusterGroups.length === 1 ? '' : 's'}</span>
		</div>
	</div>

	{#if errorMsg}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{errorMsg}
		</div>
	{/if}

	{#if isLoading && locations.length === 0}
		<div class="space-y-2 rounded-md border p-8 text-center text-sm text-muted-foreground">
			<RefreshCwIcon class="mx-auto h-5 w-5 animate-spin text-primary" />
			<p>Loading workstation occupancy for {currentCampusName}...</p>
		</div>
	{:else if clusterGroups.length === 0}
		<div class="space-y-1 rounded-md border p-8 text-center text-sm text-muted-foreground">
			<p class="font-semibold text-foreground">No active workstations</p>
			<p class="text-xs">
				{searchQuery
					? 'No matching host or login found.'
					: `No logged-in students currently detected in ${currentCampusName}.`}
			</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each clusterGroups as cluster}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2
							class="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
						>
							<LayoutGridIcon class="h-4 w-4 text-muted-foreground" />
							<span>{cluster.clusterName.replace(/^cluster\s+/i, '')}</span>
							{#if cluster.prefix && cluster.clusterName.toLowerCase() !== cluster.prefix.toLowerCase()}
								<Badge
									variant="outline"
									class="px-1.5 py-0 font-mono text-xs font-normal uppercase"
								>
									{cluster.prefix}
								</Badge>
							{/if}
						</h2>
						<span class="text-xs text-muted-foreground">
							{cluster.locations.length} active
						</span>
					</div>

					{#if cluster.locations.length === 0}
						<div
							class="rounded-md border bg-muted/10 p-4 text-center text-xs text-muted-foreground"
						>
							No active workstations in this cluster.
						</div>
					{:else}
						<div class="divide-y rounded-md border text-base">
							{#each cluster.locations as loc}
								<div
									class="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-muted/30"
								>
									<div class="flex min-w-0 items-center gap-3">
										<div
											class="flex shrink-0 items-center gap-1 font-mono text-sm font-semibold text-foreground"
										>
											{#each formatHost(loc.host) as part}
												<span>{part}</span>
											{/each}
										</div>

										{#if loc.user}
											{@const rawImg = loc.user.image?.link ?? loc.user.image?.versions?.small}
											{@const avatarUrl = rawImg ? (getCdnProxyUrl(rawImg) ?? null) : null}
											<div class="flex min-w-0 items-center gap-3">
												<Avatar.Root class="size-8 shrink-0">
													{#if avatarUrl}
														<Avatar.Image src={avatarUrl} alt={loc.user.login} />
													{/if}
													<Avatar.Fallback class="bg-muted text-xs font-semibold uppercase">
														{loc.user.login.slice(0, 2)}
													</Avatar.Fallback>
												</Avatar.Root>

												<div class="min-w-0">
													<div class="flex items-center gap-2">
														<a
															href={`/users/${loc.user.login}`}
															class="truncate text-sm font-semibold text-foreground hover:underline"
														>
															{loc.user.login}
														</a>
														{#if loc.user.displayname}
															<span class="hidden truncate text-xs text-muted-foreground sm:inline">
																{loc.user.displayname}
															</span>
														{/if}
													</div>
												</div>
											</div>
										{:else}
											<span class="text-xs text-muted-foreground">Occupied</span>
										{/if}
									</div>

									<div class="shrink-0 text-right text-xs text-muted-foreground">
										<span>{formatTimeSince(loc.begin_at)}</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Most Recent Unique Users on Campus -->
	<div class="space-y-3 border-t pt-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<HistoryIcon class="h-4 w-4 text-muted-foreground" />
				<h2 class="text-base font-semibold tracking-tight text-foreground">
					Recent Campus Activity
				</h2>
				{#if hasRequestedRecent}
					<Badge variant="outline" class="text-xs">
						{uniqueRecentUsers.length} unique user{uniqueRecentUsers.length === 1 ? '' : 's'}
					</Badge>
				{/if}
			</div>
			{#if hasRequestedRecent && recentPage > 1}
				<span class="text-xs text-muted-foreground">
					Page {recentPage}
				</span>
			{/if}
		</div>

		{#if !hasRequestedRecent}
			<div
				class="space-y-3 rounded-md border border-dashed bg-muted/10 p-6 text-center text-xs text-muted-foreground"
			>
				<p class="text-sm font-medium text-foreground">Explore Past Activity</p>
				<p class="mx-auto max-w-md text-muted-foreground">
					View students recently logged in to workstations at {currentCampusName}.
				</p>
				<div class="flex items-center justify-center pt-1">
					<Button
						variant="outline"
						size="sm"
						onclick={loadInitialRecent}
						disabled={isLoadingRecent}
						class="gap-1.5"
					>
						{#if isLoadingRecent}
							<RefreshCwIcon class="h-3.5 w-3.5 animate-spin" />
							<span>Loading recent activity...</span>
						{:else}
							<HistoryIcon class="h-3.5 w-3.5 text-muted-foreground" />
							<span>Load Recent Activity</span>
						{/if}
					</Button>
				</div>
			</div>
		{:else if isLoadingRecent && uniqueRecentUsers.length === 0}
			<div class="space-y-2 rounded-md border p-8 text-center text-xs text-muted-foreground">
				<RefreshCwIcon class="mx-auto h-4 w-4 animate-spin text-primary" />
				<p>Loading recent activity for {currentCampusName}...</p>
			</div>
		{:else if uniqueRecentUsers.length === 0}
			<div class="rounded-md border p-6 text-center text-xs text-muted-foreground">
				No recent workstation activity recorded for {currentCampusName}.
			</div>
		{:else}
			<div class="divide-y rounded-md border text-base">
				{#each uniqueRecentUsers as item}
					<div
						class="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-muted/30"
					>
						<div class="flex min-w-0 items-center gap-3">
							<Avatar.Root class="size-8 shrink-0">
								{#if item.avatarUrl}
									<Avatar.Image src={item.avatarUrl} alt={item.user.login} />
								{/if}
								<Avatar.Fallback class="bg-muted text-xs font-semibold uppercase">
									{item.user.login.slice(0, 2)}
								</Avatar.Fallback>
							</Avatar.Root>

							<div class="min-w-0">
								<div class="flex items-center gap-2">
									<a
										href={`/users/${item.user.login}`}
										class="truncate text-sm font-semibold text-foreground hover:underline"
									>
										{item.user.login}
									</a>
									{#if item.user.displayname}
										<span class="hidden truncate text-xs text-muted-foreground sm:inline">
											{item.user.displayname}
										</span>
									{/if}
								</div>
								<div class="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
									<div class="flex items-center gap-1 font-mono">
										{#each formatHost(item.location.host) as part}
											<span>{part}</span>
										{/each}
									</div>
									{#if item.location.end_at}
										<span>&bull;</span>
										<span>left {formatTimeSince(item.location.end_at)} ago</span>
									{:else}
										<span>&bull;</span>
										<span class="font-medium text-emerald-600">Currently online</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="shrink-0 text-right text-xs text-muted-foreground">
							<span>{formatTimeSince(item.location.begin_at)}</span>
						</div>
					</div>
				{/each}
			</div>

			{#if recentError}
				<div
					class="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive"
				>
					{recentError}
				</div>
			{/if}

			{#if hasMoreRecent}
				<div class="flex justify-center pt-2">
					<Button
						variant="outline"
						size="sm"
						onclick={loadMoreRecent}
						disabled={isLoadingMoreRecent}
						class="gap-1.5"
					>
						{#if isLoadingMoreRecent}
							<RefreshCwIcon class="h-3.5 w-3.5 animate-spin" />
							<span>Loading more users...</span>
						{:else}
							<span>Load more users</span>
						{/if}
					</Button>
				</div>
			{/if}
		{/if}
	</div>
</div>
