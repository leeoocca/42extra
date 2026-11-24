<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import AwardIcon from '@lucide/svelte/icons/award';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import LockIcon from '@lucide/svelte/icons/lock';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let a = $derived(data.achievement);

	let isUnlocked = $derived.by(() => {
		if (!a || !data.profile?.achievements) return false;
		return data.profile.achievements.some((ach) => ach.id === a.id);
	});

	let iconUrl = $derived.by(() => {
		if (!a?.image || typeof a.image !== 'string') return null;
		const rawUrl = a.image.startsWith('http')
			? a.image
			: `https://cdn.intra.42.fr${a.image.replace('/uploads', '')}`;
		return getCdnProxyUrl(rawUrl) ?? null;
	});
</script>

<div class="space-y-6">
	<!-- Back button above title -->
	<div>
		<Button
			variant="ghost"
			size="sm"
			href="/achievements"
			class="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
		>
			<ArrowLeftIcon class="w-3.5 h-3.5" />
			<span>Back to Achievements</span>
		</Button>
	</div>

	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{a?.name || `Achievement #${data.id}`}
				</h1>
				{#if isUnlocked}
					<Badge variant="default" class="text-[10px] px-1.5 py-0 bg-emerald-600">
						<CheckCircle2Icon class="w-3 h-3 mr-1" />
						Unlocked
					</Badge>
				{:else}
					<Badge variant="secondary" class="text-[10px] px-1.5 py-0 text-muted-foreground">
						<LockIcon class="w-2.5 h-2.5 mr-1" />
						Locked
					</Badge>
				{/if}
			</div>
			<p class="text-xs text-muted-foreground mt-0.5">
				Badge #{data.id}
			</p>
		</div>

		{#if a?.tier && a.tier !== 'none'}
			<Badge variant="outline" class="text-xs capitalize">
				Tier: {a.tier}
			</Badge>
		{/if}
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{data.error}
		</div>
	{:else if a}
		<div class="flex flex-col sm:flex-row gap-6 items-start">
			{#if iconUrl}
				<div class="border rounded-md p-4 bg-muted/20 shrink-0 self-center sm:self-start {isUnlocked ? '' : 'opacity-40 grayscale'}">
					<img
						src={iconUrl}
						alt={a.name}
						class="w-24 h-24 object-contain"
						loading="lazy"
					/>
				</div>
			{/if}

			<div class="space-y-4 flex-1 w-full">
				<!-- Description List: Achievement Metadata -->
				<div class="space-y-2">
					<h2 class="text-base font-semibold tracking-tight text-foreground">Badge Specification</h2>
					<dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 border rounded-md p-4 text-sm">
						<div>
							<dt class="text-xs text-muted-foreground font-medium">Achievement ID</dt>
							<dd class="font-semibold text-foreground mt-0.5">#{a.id}</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Category / Kind</dt>
							<dd class="text-foreground mt-0.5 capitalize font-medium">{a.kind || 'general'}</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Tier Ranking</dt>
							<dd class="text-foreground mt-0.5 capitalize font-medium">{a.tier || 'standard'}</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Your Unlock Status</dt>
							<dd class="font-semibold text-foreground mt-0.5">
								{isUnlocked ? 'Completed & Awarded' : 'Not yet achieved'}
							</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Visibility</dt>
							<dd class="text-foreground mt-0.5">
								{a.visible ? 'Publicly visible' : 'Hidden / Secret'}
							</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Success Criteria</dt>
							<dd class="text-foreground mt-0.5">
								{a.nbr_of_success ? `${a.nbr_of_success} times required` : 'One-time unlock'}
							</dd>
						</div>
					</dl>
				</div>

				{#if a.description}
					<div class="space-y-2">
						<h2 class="text-base font-semibold tracking-tight text-foreground">Requirement & Lore</h2>
						<div class="border rounded-md p-4 text-sm leading-relaxed text-foreground">
							{a.description}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
