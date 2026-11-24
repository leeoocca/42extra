<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import UserIcon from '@lucide/svelte/icons/user';
	import Building2Icon from '@lucide/svelte/icons/building-2';
	import LayersIcon from '@lucide/svelte/icons/layers';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import type { PageData } from './$types';
	import type { FtLocation, FtCluster } from '#lib/schemas/42.js';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import { groupLocationsByCluster, getCampusClusterConfig } from '#lib/config/clusters.js';
	import { onMount } from 'svelte';

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
	let isLoadingMoreRecent = $state(false);
	let hasMoreRecent = $state(true);
	let recentError = $state<string | null>(null);

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
		recentPage = 1;
		hasMoreRecent = true;

		try {
			// Fetch active locations dynamically for the active campus
			const locPromise = fetch(`/api/v2/campus/${campusId}/locations?filter[active]=true&page[size]=100`);
			// Also fetch /v2/clusters filtered by campus
			const clusterPromise = fetch(`/api/v2/clusters?filter[campus_id]=${campusId}&page[size]=100`);
			// Fetch initial page of recent locations
			const recentPromise = fetchRecentLocationsPage(campusId, 1);

			const [locRes, clusterRes, recentItems] = await Promise.all([locPromise, clusterPromise, recentPromise]);

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

			recentLocations = recentItems;
			if (recentItems.length < 100) {
				hasMoreRecent = false;
			}
		} catch (err: any) {
			errorMsg = err?.message || 'Error loading cluster locations';
		} finally {
			isLoading = false;
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

	function formatTimeSince(isoDate: string) {
		const ms = Date.now() - new Date(isoDate).getTime();
		const mins = Math.floor(ms / 60000);
		if (mins < 60) return `${mins}m`;
		const hours = Math.floor(mins / 60);
		const remMins = mins % 60;
		return `${hours}h ${remMins}m`;
	}
</script>

<div class="space-y-6">
	<!-- Top Bar -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Clusters</h1>
				<Badge variant="outline" class="text-xs px-2 py-0.5">
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
					class="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					{#each data.campuses as c}
						<option value={c.id}>
							{c.name} {c.id === data.initialCampusId ? '(Primary)' : ''}
						</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Campus Clusters (/v2/clusters) if defined -->
	{#if clusters.length > 0}
		<div class="space-y-2">
			<h2 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
				<LayersIcon class="w-3.5 h-3.5" />
				Campus Cluster Zones ({clusters.length})
			</h2>
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
				{#each clusters as cl}
					<div class="border rounded-md p-2.5 bg-muted/20 space-y-0.5">
						<span class="font-semibold text-xs text-foreground block truncate">
							{cl.name}
						</span>
						{#if cl.description}
							<p class="text-[11px] text-muted-foreground truncate">
								{cl.description}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Search & Summary bar -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
		<div class="relative w-full sm:w-72">
			<SearchIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter host or login..."
				bind:value={searchQuery}
				class="pl-8 h-8 text-xs"
			/>
		</div>

		<div class="flex items-center gap-2 text-xs text-muted-foreground">
			<span class="flex items-center gap-1">
				<MonitorIcon class="w-3.5 h-3.5" />
				{locations.length} occupied workstation{locations.length === 1 ? '' : 's'}
			</span>
			<span>&bull;</span>
			<span>{clusterGroups.length} active zone{clusterGroups.length === 1 ? '' : 's'}</span>
		</div>
	</div>

	{#if errorMsg}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{errorMsg}
		</div>
	{/if}

	{#if isLoading && locations.length === 0}
		<div class="border rounded-md p-8 text-center text-muted-foreground text-sm space-y-2">
			<RefreshCwIcon class="w-5 h-5 animate-spin mx-auto text-primary" />
			<p>Loading workstation occupancy for {currentCampusName}...</p>
		</div>
	{:else if clusterGroups.length === 0}
		<div class="border rounded-md p-8 text-center text-muted-foreground text-sm space-y-1">
			<p class="font-semibold text-foreground">No active workstations</p>
			<p class="text-xs">
				{searchQuery ? 'No matching host or login found.' : `No logged-in students currently detected in ${currentCampusName}.`}
			</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each clusterGroups as cluster}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
							<LayoutGridIcon class="w-4 h-4 text-muted-foreground" />
							<span>{cluster.clusterName.toLowerCase().startsWith('cluster') ? cluster.clusterName : `Cluster ${cluster.clusterName}`}</span>
							{#if cluster.prefix && cluster.clusterName.toLowerCase() !== cluster.prefix.toLowerCase()}
								<Badge variant="outline" class="font-mono text-[10px] uppercase font-normal px-1.5 py-0">
									{cluster.prefix}
								</Badge>
							{/if}
						</h2>
						<span class="text-xs text-muted-foreground">
							{cluster.locations.length} active
						</span>
					</div>

					<div class="border rounded-md divide-y text-sm">
						{#each cluster.locations as loc}
							<div class="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors gap-3">
								<div class="flex items-center gap-3 min-w-0">
									<span class="font-mono font-semibold text-foreground text-sm w-24 shrink-0">
										{loc.host}
									</span>

									{#if loc.user}
										<div class="flex items-center gap-2 truncate">
											<UserIcon class="w-4 h-4 text-muted-foreground shrink-0" />
											<a
												href={`/users/${loc.user.login}`}
												class="font-medium text-foreground hover:underline truncate"
											>
												{loc.user.login}
											</a>
											{#if loc.user.displayname}
												<span class="hidden sm:inline text-muted-foreground text-xs truncate">
													({loc.user.displayname})
												</span>
											{/if}
										</div>
									{:else}
										<span class="text-muted-foreground italic text-xs">Occupied</span>
									{/if}
								</div>

								<div class="flex items-center gap-2 shrink-0 text-muted-foreground text-xs">
									<span>logged in {formatTimeSince(loc.begin_at)}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Most Recent Unique Users on Campus -->
	<div class="space-y-3 pt-4 border-t">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<HistoryIcon class="w-4 h-4 text-muted-foreground" />
				<h2 class="text-base font-semibold tracking-tight text-foreground">
					Recent Campus Activity
				</h2>
				<Badge variant="outline" class="text-xs">
					{uniqueRecentUsers.length} unique user{uniqueRecentUsers.length === 1 ? '' : 's'}
				</Badge>
			</div>
			{#if recentPage > 1}
				<span class="text-xs text-muted-foreground">
					Page {recentPage}
				</span>
			{/if}
		</div>

		{#if uniqueRecentUsers.length === 0}
			<div class="border rounded-md p-6 text-center text-muted-foreground text-xs">
				No recent workstation activity recorded for {currentCampusName}.
			</div>
		{:else}
			<div class="border rounded-md divide-y text-sm">
				{#each uniqueRecentUsers as item}
					<div class="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors gap-3">
						<div class="flex items-center gap-3 min-w-0">
							<Avatar.Root class="size-8 shrink-0">
								{#if item.avatarUrl}
									<Avatar.Image src={item.avatarUrl} alt={item.user.login} />
								{/if}
								<Avatar.Fallback class="text-xs font-semibold bg-muted uppercase">
									{item.user.login.slice(0, 2)}
								</Avatar.Fallback>
							</Avatar.Root>

							<div class="min-w-0">
								<div class="flex items-center gap-2">
									<a
										href={`/users/${item.user.login}`}
										class="font-semibold text-foreground hover:underline truncate text-sm"
									>
										{item.user.login}
									</a>
									{#if item.user.displayname}
										<span class="hidden sm:inline text-muted-foreground text-xs truncate">
											{item.user.displayname}
										</span>
									{/if}
								</div>
								<div class="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
									<span class="font-mono">{item.location.host}</span>
									{#if item.location.end_at}
										<span>&bull;</span>
										<span>left {formatTimeSince(item.location.end_at)} ago</span>
									{:else}
										<span>&bull;</span>
										<span class="text-emerald-600 font-medium">Currently online</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="shrink-0 text-right text-xs text-muted-foreground">
							<span>seen {formatTimeSince(item.location.begin_at)} ago</span>
						</div>
					</div>
				{/each}
			</div>

			{#if recentError}
				<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-2.5 text-xs">
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
							<RefreshCwIcon class="w-3.5 h-3.5 animate-spin" />
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
