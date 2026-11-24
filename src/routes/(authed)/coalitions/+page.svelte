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
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Coalitions</h1>
				<Badge variant="outline" class="text-xs">
					{campusName}
				</Badge>
			</div>
		</div>

		<span class="text-xs text-muted-foreground">
			{blocsWithSortedCoalitions.length} tournament bloc{blocsWithSortedCoalitions.length === 1
				? ''
				: 's'}
		</span>
	</div>

	{#if data.error}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{data.error}
		</div>
	{/if}

	{#if blocsWithSortedCoalitions.length === 0}
		<div class="space-y-1 rounded-md border p-6 text-center text-sm text-muted-foreground">
			<p class="font-medium">No coalitions found</p>
			<p class="text-xs">No active coalition tournament blocs are assigned to {campusName}.</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each blocsWithSortedCoalitions as bloc}
				{@const cursusInfo = cursusMap.get(bloc.cursus_id)}
				{@const cursusName = cursusInfo?.name ?? `Cursus #${bloc.cursus_id}`}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="flex items-center gap-2 text-base font-semibold tracking-tight">
							<ShieldIcon class="h-4 w-4 text-muted-foreground" />
							{#if cursusInfo?.slug}
								<a href={`/cursus/${cursusInfo.slug}`} class="hover:underline">
									{cursusName}
								</a>
							{:else}
								<span>{cursusName}</span>
							{/if}
							<span class="text-xs font-normal text-muted-foreground">
								(Bloc #{bloc.id})
							</span>
						</h2>
						{#if bloc.squad_size}
							<span class="text-xs text-muted-foreground">
								squad size: {bloc.squad_size}
							</span>
						{/if}
					</div>

					<div class="divide-y rounded-md border text-base">
						{#each bloc.sortedCoalitions as coalition, rank}
							{@const logoUrl = getCoalitionLogo(coalition)}
							<div
								class="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-muted/30"
							>
								<div class="flex min-w-0 items-center gap-3">
									<!-- Rank indicator -->
									<span
										class="w-7 shrink-0 text-sm font-semibold {rank === 0
											? 'text-amber-500'
											: 'text-muted-foreground'}"
									>
										#{rank + 1}
									</span>

									<!-- Coalition color swatch -->
									<span
										class="h-3 w-3 shrink-0 rounded-full"
										style="background-color: {coalition.color || '#4180DB'};"
									></span>

									<!-- Logo -->
									{#if logoUrl}
										<img
											src={logoUrl}
											alt={coalition.name}
											class="h-7 w-7 shrink-0 object-contain"
											loading="lazy"
										/>
									{/if}

									<div class="min-w-0">
										<div class="flex items-center gap-2">
											<span class="truncate text-base font-semibold text-foreground">
												{coalition.name}
											</span>
											{#if rank === 0}
												<Badge
													variant="outline"
													class="border-amber-500/30 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400"
												>
													<TrophyIcon class="mr-1 h-3.5 w-3.5" />
													Leader
												</Badge>
											{/if}
										</div>
										<span class="block truncate font-mono text-xs text-muted-foreground">
											{coalition.slug}
										</span>
									</div>
								</div>

								<div class="shrink-0 text-right">
									<div class="text-base font-bold text-foreground">
										{(coalition.score || 0).toLocaleString()}
										<span class="text-xs font-normal text-muted-foreground">pts</span>
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
