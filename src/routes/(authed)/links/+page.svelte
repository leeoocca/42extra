<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';
	import type { PageData } from './$types';
	import { getCampusLinks } from '#lib/config/links.js';

	let { data }: { data: PageData } = $props();

	let selectedCampusId = $state<number>(data.primaryCampusId);

	let activeLinks = $derived.by(() => {
		return getCampusLinks(selectedCampusId);
	});

	let currentCampusName = $derived.by(() => {
		const c = data.campuses.find((camp) => camp.id === selectedCampusId);
		return c?.name ?? `Campus #${selectedCampusId}`;
	});

	function getCategoryIcon(cat?: string) {
		switch (cat?.toLowerCase()) {
			case 'documentation':
				return BookOpenIcon;
			case 'community':
				return MessageSquareIcon;
			default:
				return GlobeIcon;
		}
	}
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Useful Links</h1>
				<Badge variant="outline" class="px-2 py-0.5 text-xs">
					{currentCampusName}
				</Badge>
			</div>
		</div>

		{#if data.campuses.length > 1}
			<div class="flex items-center gap-2">
				<select
					bind:value={selectedCampusId}
					class="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
				>
					{#each data.campuses as c}
						<option value={c.id}>
							{c.name}
							{c.id === data.primaryCampusId ? '(Primary)' : ''}
						</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	<!-- Links Directory -->
	<div class="space-y-4">
		{#if activeLinks.length === 0}
			<div class="rounded-md border p-8 text-center text-sm text-muted-foreground">
				No specific links registered for {currentCampusName}.
			</div>
		{:else}
			<div class="divide-y rounded-md border text-base">
				{#each activeLinks as link}
					{@const Icon = getCategoryIcon(link.category)}
					<div
						class="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center"
					>
						<div class="flex min-w-0 items-start gap-3">
							<div class="mt-0.5 shrink-0 rounded-md bg-muted/60 p-2 text-muted-foreground">
								<Icon class="h-4 w-4" />
							</div>
							<div class="min-w-0 space-y-0.5">
								<div class="flex flex-wrap items-center gap-2">
									<a
										href={link.url}
										target="_blank"
										rel="noreferrer noopener"
										class="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:underline"
									>
										<span>{link.title}</span>
										<ExternalLinkIcon class="h-3.5 w-3.5 text-muted-foreground" />
									</a>
									{#if link.category}
										<Badge variant="outline" class="px-1.5 py-0 text-xs font-normal uppercase">
											{link.category}
										</Badge>
									{/if}
									{#if link.campus_ids && link.campus_ids.length > 0}
										<Badge variant="secondary" class="px-1.5 py-0 text-xs font-normal">
											Campus Specific
										</Badge>
									{/if}
								</div>
								{#if link.description}
									<p class="text-xs leading-relaxed text-muted-foreground">
										{link.description}
									</p>
								{/if}
								<span class="block truncate font-mono text-xs text-muted-foreground/75">
									{link.url}
								</span>
							</div>
						</div>

						<div class="flex shrink-0 items-center gap-2 sm:self-center">
							<Button
								variant="outline"
								size="sm"
								href={link.url}
								target="_blank"
								rel="noreferrer noopener"
								class="h-8 gap-1.5 text-xs"
							>
								<span>Open Link</span>
								<ExternalLinkIcon class="h-3 w-3" />
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
