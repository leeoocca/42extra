<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import ProjectUserRow from '#lib/components/project-user-row.svelte';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
	import SearchIcon from '@lucide/svelte/icons/search';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import type { PageData } from './$types';
	import type { FtProjectUser } from '#lib/schemas/42.js';
	import { onMount } from 'svelte';
	import { navState } from '#lib/state/nav-state.svelte.js';

	let { data }: { data: PageData } = $props();

	// Projects list initialized from session, with dynamic streaming loading of all pages
	let loadedProjects = $state<FtProjectUser[]>(data.initialProjects ?? []);
	let isStreaming = $state(false);
	let streamProgress = $state({ current: 1, totalPages: 1, totalItems: loadedProjects.length });
	let streamError = $state<string | null>(null);

	// Controls: Grouping, Filter, Search
	let groupBy = $state<'cursus' | 'status'>('cursus');
	let statusFilter = $state<'all' | 'open' | 'closed'>('all');
	let searchQuery = $state('');

	// Stream loading of all pages from 42 API
	async function streamAllProjectPages() {
		if (!data.login) return;
		isStreaming = true;
		streamError = null;

		try {
			let pageNum = 1;
			const pageSize = 100;
			let hasMore = true;
			const collectedMap = new Map<number, FtProjectUser>();

			// Populate existing
			for (const p of loadedProjects) {
				collectedMap.set(p.id, p);
			}

			while (hasMore) {
				const res = await fetch(
					`/api/v2/users/${data.login}/projects_users?page[number]=${pageNum}&page[size]=${pageSize}&sort=-updated_at`
				);
				if (!res.ok) {
					throw new Error(`Failed to stream page ${pageNum} (${res.status})`);
				}

				const items: FtProjectUser[] = await res.json();
				if (!Array.isArray(items) || items.length === 0) {
					hasMore = false;
					break;
				}

				for (const item of items) {
					collectedMap.set(item.id, item);
				}

				const totalHeader = res.headers.get('x-total');
				const total = totalHeader ? parseInt(totalHeader, 10) : collectedMap.size;
				const totalPages = Math.max(1, Math.ceil(total / pageSize));

				streamProgress = {
					current: pageNum,
					totalPages,
					totalItems: collectedMap.size
				};

				// Update reactive state as pages stream in
				loadedProjects = Array.from(collectedMap.values());

				if (pageNum >= totalPages || items.length < pageSize) {
					hasMore = false;
				} else {
					pageNum++;
				}
			}
		} catch (err: unknown) {
			streamError = err instanceof Error ? err.message : 'Error streaming projects';
		} finally {
			isStreaming = false;
		}
	}

	onMount(() => {
		// Auto stream all pages on mount
		streamAllProjectPages();
	});

	$effect(() => {
		navState.onRefresh = streamAllProjectPages;
		return () => {
			navState.onRefresh = null;
		};
	});

	// Cursus ID to Cursus object map (name and slug)
	let cursusMap = $derived.by(() => {
		const map = new Map<number, { name: string; slug: string }>();
		if (data.profile?.cursus_users) {
			for (const cu of data.profile.cursus_users) {
				if (cu.cursus) {
					map.set(cu.cursus_id, { name: cu.cursus.name, slug: cu.cursus.slug });
				}
			}
		}
		return map;
	});

	// Filter projects by open / closed and search query
	let filteredProjects = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();

		return loadedProjects.filter((pu) => {
			const isClosed = pu.status === 'finished';
			if (statusFilter === 'open' && isClosed) return false;
			if (statusFilter === 'closed' && !isClosed) return false;

			if (!q) return true;
			const nameMatch = pu.project.name?.toLowerCase().includes(q);
			const slugMatch = pu.project.slug?.toLowerCase().includes(q);
			const statusMatch = pu.status?.toLowerCase().includes(q);
			return nameMatch || slugMatch || statusMatch;
		});
	});

	// Top Summary Statistics
	let stats = $derived.by(() => {
		const total = loadedProjects.length;
		let validatedCount = 0;
		let failedCount = 0;
		let inProgressCount = 0;
		let totalScore = 0;
		let scoredCount = 0;

		for (const p of loadedProjects) {
			const isValidated = Boolean(p['validated?'] ?? p.validated);
			if (p.status === 'finished') {
				if (isValidated) {
					validatedCount++;
				} else {
					failedCount++;
				}
			} else {
				inProgressCount++;
			}

			if (p.final_mark !== null && p.final_mark !== undefined) {
				totalScore += p.final_mark;
				scoredCount++;
			}
		}

		const avgMark = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;
		const successRate =
			total > 0 ? Math.round((validatedCount / (validatedCount + failedCount || 1)) * 100) : 0;

		return {
			total,
			validatedCount,
			failedCount,
			inProgressCount,
			avgMark,
			successRate
		};
	});

	// Grouping calculation
	let groupedProjectSections = $derived.by(() => {
		if (groupBy === 'cursus') {
			const groups = new Map<string, { title: string; slug?: string; projects: FtProjectUser[] }>();

			for (const pu of filteredProjects) {
				const cursusId = pu.cursus_ids?.[0] ?? null;
				const cursusInfo = cursusId ? cursusMap.get(cursusId) : undefined;
				const cursusName =
					cursusInfo?.name ?? (cursusId ? `Cursus #${cursusId}` : 'Other Curriculum');

				if (!groups.has(cursusName)) {
					groups.set(cursusName, {
						title: cursusName,
						slug: cursusInfo?.slug,
						projects: []
					});
				}
				groups.get(cursusName)!.projects.push(pu);
			}

			return Array.from(groups.values()).map((g) => ({
				title: g.title,
				slug: g.slug,
				projects: g.projects.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
			}));
		} else {
			// Group by Status (in_progress, waiting_for_correction, finished, etc.)
			const groups = new Map<string, FtProjectUser[]>();

			for (const pu of filteredProjects) {
				const rawStatus = pu.status || 'unknown';
				const statusLabel = rawStatus.replace(/_/g, ' ');

				if (!groups.has(statusLabel)) {
					groups.set(statusLabel, []);
				}
				groups.get(statusLabel)!.push(pu);
			}

			return Array.from(groups.entries()).map(([title, projects]) => ({
				title: title.charAt(0).toUpperCase() + title.slice(1),
				slug: undefined,
				projects: projects.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
			}));
		}
	});

	function formatStatus(status: string) {
		return status.replace(/_/g, ' ');
	}

	function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
		switch (status) {
			case 'in_progress':
				return 'default';
			case 'waiting_for_correction':
				return 'secondary';
			case 'finished':
				return 'outline';
			default:
				return 'outline';
		}
	}

	function formatDate(isoDate?: string | null) {
		if (!isoDate) return '';
		const d = new Date(isoDate);
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<div class="space-y-6">
	<!-- Top Bar -->
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					Subscribed Projects
				</h1>
				<Badge variant="outline" class="text-xs">
					{stats.total} total
				</Badge>
				{#if isStreaming}
					<span class="inline-flex animate-pulse items-center gap-1 text-xs text-muted-foreground">
						<RefreshCwIcon class="h-3 w-3 animate-spin" />
						Streaming page {streamProgress.current}...
					</span>
				{/if}
			</div>
		</div>

		<!-- Top Header Controls: Grouping & Open/Closed Filter -->
		<div class="flex flex-wrap items-center gap-2">
			<!-- Open / Closed Filter -->
			<div class="flex items-center rounded-md border bg-muted/20 p-0.5 text-xs">
				<Button
					variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
					size="sm"
					class="h-7 px-2.5 text-xs font-medium"
					onclick={() => (statusFilter = 'all')}
				>
					All
				</Button>
				<Button
					variant={statusFilter === 'open' ? 'secondary' : 'ghost'}
					size="sm"
					class="h-7 px-2.5 text-xs font-medium"
					onclick={() => (statusFilter = 'open')}
				>
					Open ({stats.inProgressCount})
				</Button>
				<Button
					variant={statusFilter === 'closed' ? 'secondary' : 'ghost'}
					size="sm"
					class="h-7 px-2.5 text-xs font-medium"
					onclick={() => (statusFilter = 'closed')}
				>
					Closed ({stats.validatedCount + stats.failedCount})
				</Button>
			</div>

			<!-- Group By Dropdown / Toggle -->
			<div class="flex items-center rounded-md border bg-muted/20 p-0.5 text-xs">
				<Button
					variant={groupBy === 'cursus' ? 'secondary' : 'ghost'}
					size="sm"
					class="h-7 px-2.5 text-xs font-medium"
					onclick={() => (groupBy = 'cursus')}
				>
					By Cursus
				</Button>
				<Button
					variant={groupBy === 'status' ? 'secondary' : 'ghost'}
					size="sm"
					class="h-7 px-2.5 text-xs font-medium"
					onclick={() => (groupBy = 'status')}
				>
					By Status
				</Button>
			</div>
		</div>
	</div>

	<!-- Stats Overview Bar at the Top (Definition List: No nested cards) -->
	<dl class="grid grid-cols-2 gap-3 rounded-md border p-4 text-base sm:grid-cols-3 lg:grid-cols-6">
		<div>
			<dt class="font-medium text-muted-foreground">Total Registered</dt>
			<dd class="mt-0.5 text-xl font-bold text-foreground">{stats.total}</dd>
		</div>
		<div>
			<dt class="font-medium text-muted-foreground">In Progress (Open)</dt>
			<dd class="mt-0.5 text-xl font-bold text-primary">{stats.inProgressCount}</dd>
		</div>
		<div>
			<dt class="font-medium text-muted-foreground">Validated</dt>
			<dd class="mt-0.5 text-xl font-bold text-emerald-600">{stats.validatedCount}</dd>
		</div>
		<div>
			<dt class="font-medium text-muted-foreground">Failed / Retry</dt>
			<dd class="mt-0.5 text-xl font-bold text-destructive">{stats.failedCount}</dd>
		</div>
		<div>
			<dt class="font-medium text-muted-foreground">Average Mark</dt>
			<dd class="mt-0.5 text-xl font-bold text-foreground">{stats.avgMark}</dd>
		</div>
		<div>
			<dt class="font-medium text-muted-foreground">Success Rate</dt>
			<dd class="mt-0.5 text-xl font-bold text-foreground">{stats.successRate}%</dd>
		</div>
	</dl>

	<!-- Search & Filter Input Bar -->
	<div class="flex items-center justify-between gap-3">
		<div class="relative w-full sm:w-80">
			<SearchIcon class="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter projects by title or slug..."
				bind:value={searchQuery}
				class="h-8 pl-8 text-xs"
			/>
		</div>

		<span class="shrink-0 text-xs text-muted-foreground">
			Showing {filteredProjects.length} of {stats.total}
		</span>
	</div>

	{#if streamError}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{streamError}
		</div>
	{/if}

	<!-- Grouped Project Sections -->
	{#if filteredProjects.length === 0}
		<div class="space-y-1 rounded-md border p-8 text-center text-sm text-muted-foreground">
			<p class="font-semibold text-foreground">No matching projects found</p>
			<p class="text-xs">
				{searchQuery
					? `No project matching "${searchQuery}".`
					: 'No subscribed projects match the selected filter.'}
			</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each groupedProjectSections as group}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="flex items-center gap-2 text-base font-semibold tracking-tight">
							<FolderGit2Icon class="h-4 w-4 text-muted-foreground" />
							{#if group.slug}
								<a href={`/cursus/${group.slug}`} class="hover:underline">
									{group.title}
								</a>
							{:else}
								<span>{group.title}</span>
							{/if}
						</h2>
						<span class="text-xs text-muted-foreground">
							{group.projects.length} project{group.projects.length === 1 ? '' : 's'}
						</span>
					</div>

					<div class="divide-y overflow-hidden rounded-md border text-base">
						{#each group.projects as item}
							<ProjectUserRow projectUser={item} login={data.login} showDate={true} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
