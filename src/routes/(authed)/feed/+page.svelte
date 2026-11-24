<script lang="ts">
	import type { PageData } from './$types.js';
	import type { FeedItem, FeedItemKind, FeedResponse } from '#lib/schemas/feed.js';
	import FeedItemComponent from '#lib/components/feed/feed-item.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import FilterIcon from '@lucide/svelte/icons/filter';
	import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';

	let { data }: { data: PageData } = $props();

	// Reactive state for feed items and pagination
	let feedItems = $state<FeedItem[]>([]);
	let currentFrom = $state<string>('');
	let currentTo = $state<string>('');
	let nextFrom = $state<string>('');
	let nextTo = $state<string>('');
	let hasMore = $state<boolean>(true);

	let isRefreshing = $state(false);
	let isLoadingMore = $state(false);
	let errorMessage = $state<string | null>(null);

	$effect(() => {
		feedItems = data.initialFeed?.items ?? [];
		currentFrom = data.initialFeed?.from ?? '';
		currentTo = data.initialFeed?.to ?? '';
		nextFrom = data.initialFeed?.nextFrom ?? '';
		nextTo = data.initialFeed?.nextTo ?? '';
		hasMore = data.initialFeed?.hasMore ?? true;
		errorMessage = data.error;
	});

	// Filter state
	let activeKindFilter = $state<FeedItemKind | 'all'>('all');

	// Filtered list
	const filteredItems = $derived.by(() => {
		if (activeKindFilter === 'all') return feedItems;
		return feedItems.filter((item) => item.kind === activeKindFilter);
	});

	// Kind counts for filter badges
	const kindCounts = $derived.by(() => {
		const counts: Record<string, number> = {
			all: feedItems.length,
			project_user: 0,
			location: 0,
			quest_user: 0,
			achievement_user: 0,
			event: 0
		};
		for (const item of feedItems) {
			if (counts[item.kind] !== undefined) {
				counts[item.kind]++;
			}
		}
		return counts;
	});

	async function refreshFeed() {
		if (isRefreshing) return;
		isRefreshing = true;
		errorMessage = null;

		try {
			const res = await fetch(`/api/feed?campus_id=${data.campusId}`);
			if (!res.ok) {
				const err = await res.json().catch(() => null);
				throw new Error(err?.message || `Failed to refresh feed (${res.status})`);
			}

			const freshFeed = (await res.json()) as FeedResponse;
			feedItems = freshFeed.items;
			currentFrom = freshFeed.from;
			currentTo = freshFeed.to;
			nextFrom = freshFeed.nextFrom;
			nextTo = freshFeed.nextTo;
			hasMore = freshFeed.hasMore;
		} catch (err: any) {
			errorMessage = err?.message || 'Error refreshing feed';
		} finally {
			isRefreshing = false;
		}
	}

	async function loadMore() {
		if (isLoadingMore || !nextFrom || !nextTo) return;
		isLoadingMore = true;
		errorMessage = null;

		try {
			const res = await fetch(
				`/api/feed?campus_id=${data.campusId}&from=${encodeURIComponent(nextFrom)}&to=${encodeURIComponent(nextTo)}`
			);
			if (!res.ok) {
				const err = await res.json().catch(() => null);
				throw new Error(err?.message || `Failed to load more (${res.status})`);
			}

			const olderFeed = (await res.json()) as FeedResponse;
			if (olderFeed.items.length > 0) {
				// Deduplicate by item.id
				const existingIds = new Set(feedItems.map((i) => i.id));
				const newUniqueItems = olderFeed.items.filter((i) => !existingIds.has(i.id));
				feedItems = [...feedItems, ...newUniqueItems];
			}

			nextFrom = olderFeed.nextFrom;
			nextTo = olderFeed.nextTo;
			hasMore = olderFeed.hasMore;
		} catch (err: any) {
			errorMessage = err?.message || 'Error loading earlier activity';
		} finally {
			isLoadingMore = false;
		}
	}
</script>

<div class="space-y-6 w-full">
	<!-- Page Header -->
	<div>
		<div class="flex items-center gap-2">
			<h1 class="text-2xl font-bold tracking-tight md:text-3xl">Campus Feed</h1>
			<Badge variant="secondary" class="font-normal text-xs">
				{data.campusName}
			</Badge>
		</div>
		<p class="text-sm text-muted-foreground mt-1">
			Real-time stream of cluster check-ins, project milestones, quests, and achievements.
		</p>
	</div>

	<!-- Filter Chips -->
	<div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
		<Button
			variant={activeKindFilter === 'all' ? 'secondary' : 'ghost'}
			size="sm"
			onclick={() => (activeKindFilter = 'all')}
			class="h-7 px-2.5 rounded-full text-xs font-medium gap-1.5"
		>
			<span>All</span>
			<span class="text-[10px] tabular-nums opacity-70">({kindCounts.all})</span>
		</Button>

		<Button
			variant={activeKindFilter === 'project_user' ? 'secondary' : 'ghost'}
			size="sm"
			onclick={() => (activeKindFilter = 'project_user')}
			class="h-7 px-2.5 rounded-full text-xs font-medium gap-1.5"
		>
			<span>Projects</span>
			<span class="text-[10px] tabular-nums opacity-70">({kindCounts.project_user})</span>
		</Button>

		<Button
			variant={activeKindFilter === 'location' ? 'secondary' : 'ghost'}
			size="sm"
			onclick={() => (activeKindFilter = 'location')}
			class="h-7 px-2.5 rounded-full text-xs font-medium gap-1.5"
		>
			<span>Clusters</span>
			<span class="text-[10px] tabular-nums opacity-70">({kindCounts.location})</span>
		</Button>

		<Button
			variant={activeKindFilter === 'quest_user' ? 'secondary' : 'ghost'}
			size="sm"
			onclick={() => (activeKindFilter = 'quest_user')}
			class="h-7 px-2.5 rounded-full text-xs font-medium gap-1.5"
		>
			<span>Quests</span>
			<span class="text-[10px] tabular-nums opacity-70">({kindCounts.quest_user})</span>
		</Button>

		<Button
			variant={activeKindFilter === 'achievement_user' ? 'secondary' : 'ghost'}
			size="sm"
			onclick={() => (activeKindFilter = 'achievement_user')}
			class="h-7 px-2.5 rounded-full text-xs font-medium gap-1.5"
		>
			<span>Achievements</span>
			<span class="text-[10px] tabular-nums opacity-70">({kindCounts.achievement_user})</span>
		</Button>

		<Button
			variant={activeKindFilter === 'event' ? 'secondary' : 'ghost'}
			size="sm"
			onclick={() => (activeKindFilter = 'event')}
			class="h-7 px-2.5 rounded-full text-xs font-medium gap-1.5"
		>
			<span>Events</span>
			<span class="text-[10px] tabular-nums opacity-70">({kindCounts.event})</span>
		</Button>
	</div>

	<!-- Error Alert if any -->
	{#if errorMessage}
		<div class="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center justify-between">
			<span>{errorMessage}</span>
			<Button variant="ghost" size="sm" class="h-6 text-[11px]" onclick={refreshFeed}>
				Retry
			</Button>
		</div>
	{/if}

	<!-- Feed Stream Container -->
	<div class="rounded-xl border border-border overflow-hidden">
		{#if filteredItems.length === 0}
			<div class="p-12 text-center">
				<div class="mx-auto flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground mb-3">
					<CalendarClockIcon class="size-5" />
				</div>
				<h3 class="text-sm font-semibold text-foreground">No activity in this window</h3>
				<p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
					No {activeKindFilter !== 'all' ? activeKindFilter.replace('_', ' ') : 'campus'} events were found for the selected time range. Try loading earlier activity below.
				</p>
			</div>
		{:else}
			<div class="divide-y divide-border/60">
				{#each filteredItems as item (item.id)}
					<FeedItemComponent {item} />
				{/each}
			</div>
		{/if}
	</div>

	<!-- Load More Button -->
	{#if hasMore}
		<div class="flex justify-center pt-2 pb-8">
			<Button
				variant="outline"
				size="sm"
				onclick={loadMore}
				disabled={isLoadingMore}
				class="gap-2 h-9 px-4 text-xs font-medium"
			>
				{#if isLoadingMore}
					<Loader2Icon class="size-3.5 animate-spin" />
					<span>Loading earlier activity...</span>
				{:else}
					<CalendarClockIcon class="size-3.5 text-muted-foreground" />
					<span>Load more (previous 24h)</span>
				{/if}
			</Button>
		</div>
	{/if}
</div>
