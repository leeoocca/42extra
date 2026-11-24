<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import type { PageData } from './$types';
	import type { FtCursus } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');

	let enrolledCursusIds = $derived.by(() => {
		const set = new Set<number>();
		if (data.profile?.cursus_users) {
			for (const cu of data.profile.cursus_users) {
				set.add(cu.cursus_id);
			}
		}
		return set;
	});

	let filteredCursuses = $derived.by(() => {
		const list = data.cursuses ?? [];
		const q = searchQuery.trim().toLowerCase();
		if (!q) return list;

		return list.filter((c) => {
			const nameMatch = c.name?.toLowerCase().includes(q);
			const slugMatch = c.slug?.toLowerCase().includes(q);
			const idMatch = String(c.id) === q || (q.startsWith('#') && String(c.id) === q.slice(1));
			return nameMatch || slugMatch || idMatch;
		});
	});

	let activeCursuses = $derived.by(() => {
		return filteredCursuses.filter((c) => !c.kind?.includes('deprecated'));
	});

	let archivedCursuses = $derived.by(() => {
		return filteredCursuses.filter((c) => c.kind?.includes('deprecated'));
	});
</script>

<div class="space-y-6">
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Cursuses</h1>
		</div>

		<div class="relative w-full sm:w-64">
			<SearchIcon class="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter by name, slug, or #id..."
				bind:value={searchQuery}
				class="h-8 pl-8 text-xs"
			/>
		</div>
	</div>

	{#if data.error}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{data.error}
		</div>
	{/if}

	<!-- Active Cursuses -->
	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<h2 class="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
				<BookOpenIcon class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
				Active Programs
			</h2>
			<span class="text-xs text-muted-foreground">
				{activeCursuses.length} cursus{activeCursuses.length === 1 ? '' : 'es'}
			</span>
		</div>

		{#if activeCursuses.length === 0}
			<p class="rounded-md border p-4 text-sm text-muted-foreground">
				No active cursus matches your query.
			</p>
		{:else}
			<div class="divide-y rounded-md border text-base">
				{#each activeCursuses as item}
					<a
						href={`/cursus/${item.slug}`}
						class="group block flex items-center justify-between gap-3 p-3 text-inherit transition-colors hover:bg-muted/30"
					>
						<div class="flex min-w-0 items-center gap-2.5">
							<span class="w-8 shrink-0 text-xs text-muted-foreground">
								#{item.id}
							</span>
							<span class="truncate font-semibold text-foreground group-hover:underline">
								{item.name}
							</span>
							<span class="hidden truncate font-mono text-xs text-muted-foreground md:inline">
								{item.slug}
							</span>
						</div>

						<div class="flex shrink-0 items-center gap-2">
							{#if enrolledCursusIds.has(item.id)}
								<Badge
									variant="default"
									class="bg-emerald-600 px-2 py-0.5 text-xs hover:bg-emerald-700"
								>
									<CheckCircle2Icon class="mr-1 h-3 w-3" />
									Enrolled
								</Badge>
							{/if}
							<Badge variant="outline" class="px-2 py-0.5 text-xs capitalize">
								{item.kind || 'main'}
							</Badge>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Deprecated / Archived Cursuses -->
	<div class="space-y-2 pt-2">
		<div class="flex items-center justify-between">
			<h2
				class="flex items-center gap-2 text-base font-semibold tracking-tight text-muted-foreground"
			>
				<ArchiveIcon class="h-4 w-4 text-muted-foreground" />
				Archived / Deprecated
			</h2>
			<span class="text-xs text-muted-foreground">
				{archivedCursuses.length} cursus{archivedCursuses.length === 1 ? '' : 'es'}
			</span>
		</div>

		{#if archivedCursuses.length === 0}
			<p class="rounded-md border p-4 text-sm text-muted-foreground">
				No archived cursus matches your query.
			</p>
		{:else}
			<div class="divide-y rounded-md border text-base opacity-85">
				{#each archivedCursuses as item}
					<a
						href={`/cursus/${item.slug}`}
						class="group block flex items-center justify-between gap-3 p-3 text-inherit transition-colors hover:bg-muted/30"
					>
						<div class="flex min-w-0 items-center gap-2.5">
							<span class="w-8 shrink-0 text-xs text-muted-foreground">
								#{item.id}
							</span>
							<span class="truncate font-medium text-foreground group-hover:underline">
								{item.name}
							</span>
							<span class="hidden truncate font-mono text-xs text-muted-foreground md:inline">
								{item.slug}
							</span>
						</div>

						<div class="flex shrink-0 items-center gap-2">
							{#if enrolledCursusIds.has(item.id)}
								<Badge variant="secondary" class="px-2 py-0.5 text-xs">
									<CheckCircle2Icon class="mr-1 h-3 w-3" />
									Enrolled
								</Badge>
							{/if}
							<Badge variant="secondary" class="px-2 py-0.5 text-xs text-muted-foreground">
								{item.kind}
							</Badge>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
