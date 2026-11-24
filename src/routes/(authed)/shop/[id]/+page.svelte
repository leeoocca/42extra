<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CoinsIcon from '@lucide/svelte/icons/coins';
	import StoreIcon from '@lucide/svelte/icons/store';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let prod = $derived(data.product);
	let userWallet = $derived(data.profile?.wallet ?? 0);

	let imageUrl = $derived.by(() => {
		if (!prod?.image?.url || typeof prod.image.url !== 'string') return null;
		const rawUrl = prod.image.url.startsWith('http')
			? prod.image.url
			: `https://cdn.intra.42.fr${prod.image.url.replace('/uploads', '')}`;
		return getCdnProxyUrl(rawUrl) ?? null;
	});

	let canAfford = $derived(prod ? userWallet >= prod.price : false);
</script>

<div class="space-y-6">
	<!-- Back button above title -->
	<div>
		<Button
			variant="ghost"
			size="sm"
			href="/shop"
			class="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
		>
			<ArrowLeftIcon class="h-3.5 w-3.5" />
			<span>Back to Shop</span>
		</Button>
	</div>

	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{prod?.name || `Product #${data.id}`}
				</h1>
				{#if prod?.kind}
					<Badge variant="outline" class="px-1.5 py-0 text-xs capitalize">
						{prod.kind}
					</Badge>
				{/if}
			</div>
			<p class="mt-0.5 text-xs text-muted-foreground">
				Item #{data.id}
			</p>
		</div>

		<div class="flex items-center gap-2">
			<span class="text-base font-bold text-foreground">
				{prod?.price ?? 0} ₳
			</span>
		</div>
	</div>

	{#if data.error}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{data.error}
		</div>
	{:else if prod}
		<!-- Image & Details Layout -->
		<div class="flex flex-col items-start gap-6 sm:flex-row">
			{#if imageUrl}
				<div class="shrink-0 self-center rounded-md border bg-muted/20 p-4 sm:self-start">
					<img src={imageUrl} alt={prod.name} class="h-36 w-36 object-contain" loading="lazy" />
				</div>
			{/if}

			<div class="w-full flex-1 space-y-4">
				<!-- Description List: Product Metadata -->
				<div class="space-y-2">
					<h2 class="text-base font-semibold tracking-tight text-foreground">
						Product Specification
					</h2>
					<dl
						class="grid grid-cols-1 gap-x-6 gap-y-3.5 rounded-md border p-4 text-base sm:grid-cols-2"
					>
						<div>
							<dt class="text-sm font-medium text-muted-foreground">Product ID</dt>
							<dd class="mt-0.5 font-semibold text-foreground">#{prod.id}</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Slug</dt>
							<dd class="mt-0.5 truncate font-mono text-foreground">{prod.slug || 'N/A'}</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Price in Altarians</dt>
							<dd class="mt-0.5 flex items-center gap-1.5 font-semibold text-foreground">
								<CoinsIcon class="h-3.5 w-3.5 text-amber-500" />
								{prod.price} ₳
								<span class="text-xs font-normal text-muted-foreground">
									({canAfford ? 'Affordable' : `Need ${prod.price - userWallet} more ₳`})
								</span>
							</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Stock Availability</dt>
							<dd class="mt-0.5 text-foreground">
								{#if prod.quantity !== null && prod.quantity !== undefined}
									{#if prod.quantity > 0}
										<span class="font-semibold text-emerald-600">
											{prod.quantity} available in stock
										</span>
									{:else}
										<span class="font-medium text-destructive">Out of stock</span>
									{/if}
								{:else}
									<span class="font-medium text-emerald-600">Available</span>
								{/if}
							</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Your Current Balance</dt>
							<dd class="mt-0.5 font-medium text-foreground">
								{userWallet} ₳
							</dd>
						</div>

						<div>
							<dt class="text-sm font-medium text-muted-foreground">Category</dt>
							<dd class="mt-0.5 text-foreground capitalize">
								{prod.kind || 'Goodies'}
							</dd>
						</div>
					</dl>
				</div>

				{#if prod.description}
					<div class="space-y-2">
						<h2 class="text-base font-semibold tracking-tight text-foreground">Description</h2>
						<div
							class="rounded-md border p-4 text-sm leading-relaxed whitespace-pre-line text-foreground"
						>
							{prod.description}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
