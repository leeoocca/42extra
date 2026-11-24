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
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Useful Links</h1>
				<Badge variant="outline" class="text-xs px-2 py-0.5">
					{currentCampusName}
				</Badge>
			</div>
		</div>

		{#if data.campuses.length > 1}
			<div class="flex items-center gap-2">
				<select
					bind:value={selectedCampusId}
					class="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					{#each data.campuses as c}
						<option value={c.id}>
							{c.name} {c.id === data.primaryCampusId ? '(Primary)' : ''}
						</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	<!-- Links Directory -->
	<div class="space-y-4">
		{#if activeLinks.length === 0}
			<div class="border rounded-md p-8 text-center text-muted-foreground text-sm">
				No specific links registered for {currentCampusName}.
			</div>
		{:else}
			<div class="border rounded-md divide-y text-sm">
				{#each activeLinks as link}
					{@const Icon = getCategoryIcon(link.category)}
					<div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-3">
						<div class="flex items-start gap-3 min-w-0">
							<div class="p-2 rounded-md bg-muted/60 text-muted-foreground shrink-0 mt-0.5">
								<Icon class="w-4 h-4" />
							</div>
							<div class="min-w-0 space-y-0.5">
								<div class="flex items-center gap-2 flex-wrap">
									<a
										href={link.url}
										target="_blank"
										rel="noreferrer noopener"
										class="font-semibold text-foreground hover:underline inline-flex items-center gap-1 text-sm"
									>
										<span>{link.title}</span>
										<ExternalLinkIcon class="w-3.5 h-3.5 text-muted-foreground" />
									</a>
									{#if link.category}
										<Badge variant="outline" class="text-[10px] uppercase font-normal px-1.5 py-0">
											{link.category}
										</Badge>
									{/if}
									{#if link.campus_ids && link.campus_ids.length > 0}
										<Badge variant="secondary" class="text-[10px] px-1.5 py-0 font-normal">
											Campus Specific
										</Badge>
									{/if}
								</div>
								{#if link.description}
									<p class="text-xs text-muted-foreground leading-relaxed">
										{link.description}
									</p>
								{/if}
								<span class="text-[11px] font-mono text-muted-foreground/75 truncate block">
									{link.url}
								</span>
							</div>
						</div>

						<div class="flex items-center gap-2 shrink-0 sm:self-center">
							<Button
								variant="outline"
								size="sm"
								href={link.url}
								target="_blank"
								rel="noreferrer noopener"
								class="gap-1.5 h-8 text-xs"
							>
								<span>Open Link</span>
								<ExternalLinkIcon class="w-3 h-3" />
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
