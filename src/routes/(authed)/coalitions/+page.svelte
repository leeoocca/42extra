<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import TrophyIcon from '@lucide/svelte/icons/trophy';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import type { PageData } from './$types';
	import type { FtBloc, FtCoalition } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	let campusName = $derived(data.primaryCampus?.name ?? `Campus #${data.primaryCampusId}`);

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

	// Sort coalitions within each bloc by score descending
	let blocsWithSortedCoalitions = $derived.by(() => {
		const list = data.blocs ?? [];
		return list
			.filter((b) => b.coalitions && b.coalitions.length > 0)
			.map((b) => ({
				...b,
				sortedCoalitions: [...b.coalitions].sort((a, b) => (b.score || 0) - (a.score || 0))
			}));
	});

	function getCoalitionLogo(c: FtCoalition): string | null {
		if (!c.image_url) return null;
		return getCdnProxyUrl(c.image_url) ?? null;
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Coalitions</h1>
				<Badge variant="outline" class="text-xs">
					{campusName}
				</Badge>
			</div>
		</div>

		<span class="text-xs text-muted-foreground">
			{blocsWithSortedCoalitions.length} tournament bloc{blocsWithSortedCoalitions.length === 1 ? '' : 's'}
		</span>
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{data.error}
		</div>
	{/if}

	{#if blocsWithSortedCoalitions.length === 0}
		<div class="border rounded-md p-6 text-center text-muted-foreground text-sm space-y-1">
			<p class="font-medium">No coalitions found</p>
			<p class="text-xs">No active coalition tournament blocs are assigned to {campusName}.</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each blocsWithSortedCoalitions as bloc}
				{@const cursusName = cursusMap.get(bloc.cursus_id) ?? `Cursus #${bloc.cursus_id}`}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="text-base font-semibold tracking-tight flex items-center gap-2">
							<ShieldIcon class="w-4 h-4 text-muted-foreground" />
							{cursusName}
							<span class="text-xs text-muted-foreground font-normal">
								(Bloc #{bloc.id})
							</span>
						</h2>
						{#if bloc.squad_size}
							<span class="text-xs text-muted-foreground">
								squad size: {bloc.squad_size}
							</span>
						{/if}
					</div>

					<div class="border rounded-md divide-y text-sm">
						{#each bloc.sortedCoalitions as coalition, rank}
							{@const logoUrl = getCoalitionLogo(coalition)}
							<div class="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3">
								<div class="flex items-center gap-3 min-w-0">
									<!-- Rank indicator -->
									<span class="text-sm w-7 shrink-0 font-semibold {rank === 0 ? 'text-amber-500' : 'text-muted-foreground'}">
										#{rank + 1}
									</span>

									<!-- Coalition color swatch -->
									<span
										class="w-3 h-3 rounded-full shrink-0"
										style="background-color: {coalition.color || '#4180DB'};"
									></span>

									<!-- Logo -->
									{#if logoUrl}
										<img
											src={logoUrl}
											alt={coalition.name}
											class="w-7 h-7 object-contain shrink-0"
											loading="lazy"
										/>
									{/if}

									<div class="min-w-0">
										<div class="flex items-center gap-2">
											<span class="font-semibold text-base text-foreground truncate">
												{coalition.name}
											</span>
											{#if rank === 0}
												<Badge variant="outline" class="text-xs px-2 py-0.5 text-amber-600 dark:text-amber-400 border-amber-500/30">
													<TrophyIcon class="w-3.5 h-3.5 mr-1" />
													Leader
												</Badge>
											{/if}
										</div>
										<span class="text-muted-foreground font-mono text-xs truncate block">
											{coalition.slug}
										</span>
									</div>
								</div>

								<div class="text-right shrink-0">
									<div class="font-bold text-base text-foreground">
										{(coalition.score || 0).toLocaleString()} <span class="text-xs font-normal text-muted-foreground">pts</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
