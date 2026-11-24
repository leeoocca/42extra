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
			class="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
		>
			<ArrowLeftIcon class="h-3.5 w-3.5" />
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
					<Badge variant="default" class="bg-emerald-600 px-1.5 py-0 text-xs">
						<CheckCircle2Icon class="mr-1 h-3 w-3" />
						Unlocked
					</Badge>
				{:else}
					<Badge variant="secondary" class="px-1.5 py-0 text-xs text-muted-foreground">
						<LockIcon class="mr-1 h-2.5 w-2.5" />
						Locked
					</Badge>
				{/if}
			</div>
			<p class="mt-0.5 text-xs text-muted-foreground">
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
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{data.error}
		</div>
	{:else if a}
		<div class="flex flex-col items-start gap-6 sm:flex-row">
			{#if iconUrl}
				<div
					class="shrink-0 self-center rounded-md border bg-muted/20 p-4 sm:self-start {isUnlocked
						? ''
						: 'opacity-40 grayscale'}"
				>
					<img src={iconUrl} alt={a.name} class="h-24 w-24 object-contain" loading="lazy" />
				</div>
			{/if}

			<div class="w-full flex-1 space-y-4">
				<!-- Description List: Achievement Metadata -->
				<div class="space-y-2">
					<h2 class="text-base font-semibold tracking-tight text-foreground">
						Badge Specification
					</h2>
					<dl
						class="grid grid-cols-1 gap-x-6 gap-y-3.5 rounded-md border p-4 text-base sm:grid-cols-2"
					>
						<div>
							<dt class="text-sm font-medium text-muted-foreground">Achievement ID</dt>
							<dd class="mt-0.5 font-semibold text-foreground">#{a.id}</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Category / Kind</dt>
							<dd class="mt-0.5 font-medium text-foreground capitalize">{a.kind || 'general'}</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Tier Ranking</dt>
							<dd class="mt-0.5 font-medium text-foreground capitalize">{a.tier || 'standard'}</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Your Unlock Status</dt>
							<dd class="mt-0.5 font-semibold text-foreground">
								{isUnlocked ? 'Completed & Awarded' : 'Not yet achieved'}
							</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Visibility</dt>
							<dd class="mt-0.5 text-foreground">
								{a.visible ? 'Publicly visible' : 'Hidden / Secret'}
							</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Success Criteria</dt>
							<dd class="mt-0.5 text-foreground">
								{a.nbr_of_success ? `${a.nbr_of_success} times required` : 'One-time unlock'}
							</dd>
						</div>
					</dl>
				</div>

				{#if a.description}
					<div class="space-y-2">
						<h2 class="text-base font-semibold tracking-tight text-foreground">
							Requirement & Lore
						</h2>
						<div class="rounded-md border p-4 text-sm leading-relaxed text-foreground">
							{a.description}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
