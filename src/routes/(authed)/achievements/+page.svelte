<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import AwardIcon from '@lucide/svelte/icons/award';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import LockIcon from '@lucide/svelte/icons/lock';
	import type { PageData } from './$types';
	import type { FtAchievement } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');

	let unlockedAchievementIds = $derived.by(() => {
		const set = new Set<number>();
		if (data.profile?.achievements) {
			for (const a of data.profile.achievements) {
				set.add(a.id);
			}
		}
		return set;
	});

	let filteredAchievements = $derived.by(() => {
		const list = data.achievements ?? [];
		const q = searchQuery.trim().toLowerCase();
		if (!q) return list;

		return list.filter((a) => {
			const nameMatch = a.name?.toLowerCase().includes(q);
			const descMatch = a.description?.toLowerCase().includes(q);
			const kindMatch = a.kind?.toLowerCase().includes(q);
			const tierMatch = a.tier?.toLowerCase().includes(q);
			return nameMatch || descMatch || kindMatch || tierMatch;
		});
	});

	// Group by kind (e.g. project, scolarity, pedagogy, social, etc.)
	let groupedAchievements = $derived.by(() => {
		const map = new Map<string, FtAchievement[]>();

		for (const a of filteredAchievements) {
			const kind = a.kind || 'general';
			if (!map.has(kind)) {
				map.set(kind, []);
			}
			map.get(kind)!.push(a);
		}

		return Array.from(map.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([kind, items]) => ({
				kind,
				title: kind.replace(/_/g, ' '),
				items
			}));
	});

	function getAchievementImage(a: FtAchievement): string | null {
		if (!a.image || typeof a.image !== 'string') return null;
		const rawUrl = a.image.startsWith('http')
			? a.image
			: `https://cdn.intra.42.fr${a.image.replace('/uploads', '')}`;
		return getCdnProxyUrl(rawUrl) ?? null;
	}

	function getTierVariant(tier?: string): 'default' | 'secondary' | 'outline' {
		switch (tier) {
			case 'master':
			case 'gold':
				return 'default';
			case 'silver':
			case 'medium':
				return 'secondary';
			default:
				return 'outline';
		}
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Achievements</h1>
				<Badge variant="outline" class="text-xs">
					{unlockedAchievementIds.size} unlocked
				</Badge>
			</div>
		</div>

		<div class="relative w-full sm:w-64">
			<SearchIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter achievements..."
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

	{#if groupedAchievements.length === 0}
		<div class="border rounded-md p-6 text-center text-muted-foreground text-sm space-y-1">
			<p class="font-medium">No achievements found</p>
			<p class="text-xs">
				{searchQuery ? 'No badge matches your query.' : 'No achievements available.'}
			</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each groupedAchievements as group}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="text-base font-semibold tracking-tight flex items-center gap-2 capitalize">
							<AwardIcon class="w-4 h-4 text-muted-foreground" />
							{group.title}
						</h2>
						<span class="text-xs text-muted-foreground">
							{group.items.length} badge{group.items.length === 1 ? '' : 's'}
						</span>
					</div>

					<div class="border rounded-md divide-y text-sm">
						{#each group.items as item}
							{@const isUnlocked = unlockedAchievementIds.has(item.id)}
							{@const iconUrl = getAchievementImage(item)}
							<div class="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors gap-3">
								<div class="flex items-center gap-3 min-w-0">
									{#if iconUrl}
										<img
											src={iconUrl}
											alt={item.name}
											class="w-8 h-8 object-contain shrink-0 {isUnlocked ? '' : 'opacity-40 grayscale'}"
											loading="lazy"
										/>
									{:else}
										<div class="w-8 h-8 rounded border flex items-center justify-center shrink-0 {isUnlocked ? 'text-primary' : 'text-muted-foreground/40'}">
											<AwardIcon class="w-4 h-4" />
										</div>
									{/if}

									<div class="min-w-0">
										<div class="flex items-center gap-2">
											<a
												href={`/achievements/${item.id}`}
												class="font-semibold text-sm text-foreground hover:underline truncate"
											>
												{item.name}
											</a>
											{#if item.tier && item.tier !== 'none'}
												<Badge variant={getTierVariant(item.tier)} class="text-xs px-2 py-0.5 capitalize">
													{item.tier}
												</Badge>
											{/if}
										</div>

										{#if item.description}
											<p class="text-muted-foreground text-xs line-clamp-1">
												{item.description}
											</p>
										{/if}
									</div>
								</div>

								<div class="flex items-center gap-2 shrink-0">
									{#if isUnlocked}
										<Badge variant="default" class="text-xs px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700">
											<CheckCircle2Icon class="w-3.5 h-3.5 mr-1" />
											Unlocked
										</Badge>
									{:else}
										<Badge variant="secondary" class="text-xs px-2 py-0.5 text-muted-foreground">
											<LockIcon class="w-3 h-3 mr-1" />
											Locked
										</Badge>
									{/if}
									<a
										href={`/achievements/${item.id}`}
										class="text-xs text-muted-foreground hover:text-foreground ml-1"
									>
										&rarr;
									</a>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
