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
				const res = await fetch(`/api/v2/users/${data.login}/projects_users?page[number]=${pageNum}&page[size]=${pageSize}&sort=-updated_at`);
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

	// Cursus ID to Cursus name map
	let cursusMap = $derived.by(() => {
		const map = new Map<number, string>();
		if (data.profile?.cursus_users) {
			for (const cu of data.profile.cursus_users) {
				if (cu.cursus) {
					map.set(cu.cursus_id, cu.cursus.name);
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
		const successRate = total > 0 ? Math.round((validatedCount / (validatedCount + failedCount || 1)) * 100) : 0;

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
			const groups = new Map<string, FtProjectUser[]>();

			for (const pu of filteredProjects) {
				const cursusId = pu.cursus_ids?.[0] ?? null;
				const cursusName = cursusId ? cursusMap.get(cursusId) ?? `Cursus #${cursusId}` : 'Other Curriculum';

				if (!groups.has(cursusName)) {
					groups.set(cursusName, []);
				}
				groups.get(cursusName)!.push(pu);
			}

			return Array.from(groups.entries()).map(([title, projects]) => ({
				title,
				projects: projects.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
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
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Subscribed Projects</h1>
				<Badge variant="outline" class="text-xs">
					{stats.total} total
				</Badge>
				{#if isStreaming}
					<span class="inline-flex items-center gap-1 text-xs text-muted-foreground animate-pulse">
						<RefreshCwIcon class="w-3 h-3 animate-spin" />
						Streaming page {streamProgress.current}...
					</span>
				{/if}
			</div>
		</div>

		<!-- Top Header Controls: Grouping & Open/Closed Filter -->
		<div class="flex items-center gap-2 flex-wrap">
			<!-- Open / Closed Filter -->
			<div class="flex items-center rounded-md border p-0.5 bg-muted/20 text-xs">
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
			<div class="flex items-center rounded-md border p-0.5 bg-muted/20 text-xs">
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
	<dl class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 border rounded-md p-4 text-xs">
		<div>
			<dt class="text-muted-foreground font-medium">Total Registered</dt>
			<dd class="text-xl font-bold text-foreground mt-0.5">{stats.total}</dd>
		</div>
		<div>
			<dt class="text-muted-foreground font-medium">In Progress (Open)</dt>
			<dd class="text-xl font-bold text-primary mt-0.5">{stats.inProgressCount}</dd>
		</div>
		<div>
			<dt class="text-muted-foreground font-medium">Validated</dt>
			<dd class="text-xl font-bold text-emerald-600 mt-0.5">{stats.validatedCount}</dd>
		</div>
		<div>
			<dt class="text-muted-foreground font-medium">Failed / Retry</dt>
			<dd class="text-xl font-bold text-destructive mt-0.5">{stats.failedCount}</dd>
		</div>
		<div>
			<dt class="text-muted-foreground font-medium">Average Mark</dt>
			<dd class="text-xl font-bold text-foreground mt-0.5">{stats.avgMark}</dd>
		</div>
		<div>
			<dt class="text-muted-foreground font-medium">Success Rate</dt>
			<dd class="text-xl font-bold text-foreground mt-0.5">{stats.successRate}%</dd>
		</div>
	</dl>

	<!-- Search & Filter Input Bar -->
	<div class="flex items-center justify-between gap-3">
		<div class="relative w-full sm:w-80">
			<SearchIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter projects by title or slug..."
				bind:value={searchQuery}
				class="pl-8 h-8 text-xs"
			/>
		</div>

		<span class="text-xs text-muted-foreground shrink-0">
			Showing {filteredProjects.length} of {stats.total}
		</span>
	</div>

	{#if streamError}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{streamError}
		</div>
	{/if}

	<!-- Grouped Project Sections -->
	{#if filteredProjects.length === 0}
		<div class="border rounded-md p-8 text-center text-muted-foreground text-sm space-y-1">
			<p class="font-semibold text-foreground">No matching projects found</p>
			<p class="text-xs">
				{searchQuery ? `No project matching "${searchQuery}".` : 'No subscribed projects match the selected filter.'}
			</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each groupedProjectSections as group}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="text-base font-semibold tracking-tight flex items-center gap-2">
							<FolderGit2Icon class="w-4 h-4 text-muted-foreground" />
							{group.title}
						</h2>
						<span class="text-xs text-muted-foreground">
							{group.projects.length} project{group.projects.length === 1 ? '' : 's'}
						</span>
					</div>

					<div class="border rounded-md divide-y text-sm overflow-hidden">
						{#each group.projects as item}
							<ProjectUserRow projectUser={item} login={data.login} showDate={true} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
