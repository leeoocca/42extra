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
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Cursuses</h1>
		</div>

		<div class="relative w-full sm:w-64">
			<SearchIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter by name, slug, or #id..."
				bind:value={searchQuery}
				class="pl-8 h-8 text-xs"
			/>
		</div>
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{data.error}
		</div>
	{/if}

	<!-- Active Cursuses -->
	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<h2 class="text-base font-semibold tracking-tight flex items-center gap-2 text-foreground">
				<BookOpenIcon class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
				Active Programs
			</h2>
			<span class="text-xs text-muted-foreground">
				{activeCursuses.length} cursus{activeCursuses.length === 1 ? '' : 'es'}
			</span>
		</div>

		{#if activeCursuses.length === 0}
			<p class="text-sm text-muted-foreground p-4 border rounded-md">No active cursus matches your query.</p>
		{:else}
			<div class="border rounded-md divide-y text-sm">
				{#each activeCursuses as item}
					<div class="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors gap-3">
						<div class="flex items-center gap-2.5 min-w-0">
							<span class="text-muted-foreground text-xs shrink-0 w-8">
								#{item.id}
							</span>
							<a href={`/cursus/${item.slug}`} class="font-semibold text-foreground hover:underline truncate">
								{item.name}
							</a>
							<span class="hidden md:inline font-mono text-muted-foreground text-xs truncate">
								{item.slug}
							</span>
						</div>

						<div class="flex items-center gap-2 shrink-0">
							{#if enrolledCursusIds.has(item.id)}
								<Badge variant="default" class="text-xs px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700">
									<CheckCircle2Icon class="w-3 h-3 mr-1" />
									Enrolled
								</Badge>
							{/if}
							<Badge variant="outline" class="text-xs px-2 py-0.5 capitalize">
								{item.kind || 'main'}
							</Badge>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Deprecated / Archived Cursuses -->
	<div class="space-y-2 pt-2">
		<div class="flex items-center justify-between">
			<h2 class="text-base font-semibold tracking-tight flex items-center gap-2 text-muted-foreground">
				<ArchiveIcon class="w-4 h-4 text-muted-foreground" />
				Archived / Deprecated
			</h2>
			<span class="text-xs text-muted-foreground">
				{archivedCursuses.length} cursus{archivedCursuses.length === 1 ? '' : 'es'}
			</span>
		</div>

		{#if archivedCursuses.length === 0}
			<p class="text-sm text-muted-foreground p-4 border rounded-md">No archived cursus matches your query.</p>
		{:else}
			<div class="border rounded-md divide-y text-sm opacity-85">
				{#each archivedCursuses as item}
					<div class="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors gap-3">
						<div class="flex items-center gap-2.5 min-w-0">
							<span class="text-muted-foreground text-xs shrink-0 w-8">
								#{item.id}
							</span>
							<a href={`/cursus/${item.slug}`} class="font-medium text-foreground hover:underline truncate">
								{item.name}
							</a>
							<span class="hidden md:inline font-mono text-muted-foreground text-xs truncate">
								{item.slug}
							</span>
						</div>

						<div class="flex items-center gap-2 shrink-0">
							{#if enrolledCursusIds.has(item.id)}
								<Badge variant="secondary" class="text-xs px-2 py-0.5">
									<CheckCircle2Icon class="w-3 h-3 mr-1" />
									Enrolled
								</Badge>
							{/if}
							<Badge variant="secondary" class="text-xs px-2 py-0.5 text-muted-foreground">
								{item.kind}
							</Badge>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
