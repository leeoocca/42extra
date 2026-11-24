<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
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
	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b pb-4">
		<div class="flex items-center gap-3">
			<a
				href="/shop"
				class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border rounded px-2 py-1"
			>
				<ArrowLeftIcon class="w-3 h-3" />
				Back
			</a>

			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
						{prod?.name || `Product #${data.id}`}
					</h1>
					{#if prod?.kind}
						<Badge variant="outline" class="text-[10px] capitalize px-1.5 py-0">
							{prod.kind}
						</Badge>
					{/if}
				</div>
				<p class="text-xs text-muted-foreground mt-0.5">
					Item #{data.id}
				</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<span class="font-bold text-base text-foreground">
				{prod?.price ?? 0} ₳
			</span>
		</div>
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{data.error}
		</div>
	{:else if prod}
		<!-- Image & Details Layout -->
		<div class="flex flex-col sm:flex-row gap-6 items-start">
			{#if imageUrl}
				<div class="border rounded-md p-4 bg-muted/20 shrink-0 self-center sm:self-start">
					<img
						src={imageUrl}
						alt={prod.name}
						class="w-36 h-36 object-contain"
						loading="lazy"
					/>
				</div>
			{/if}

			<div class="space-y-4 flex-1 w-full">
				<!-- Description List: Product Metadata -->
				<div class="space-y-2">
					<h2 class="text-base font-semibold tracking-tight text-foreground">Product Specification</h2>
					<dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 border rounded-md p-4 text-sm">
						<div>
							<dt class="text-xs text-muted-foreground font-medium">Product ID</dt>
							<dd class="font-semibold text-foreground mt-0.5">#{prod.id}</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Slug</dt>
							<dd class="font-mono text-foreground mt-0.5 truncate">{prod.slug || 'N/A'}</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Price in Altarians</dt>
							<dd class="font-semibold text-foreground mt-0.5 flex items-center gap-1.5">
								<CoinsIcon class="w-3.5 h-3.5 text-amber-500" />
								{prod.price} ₳
								<span class="text-xs font-normal text-muted-foreground">
									({canAfford ? 'Affordable' : `Need ${prod.price - userWallet} more ₳`})
								</span>
							</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Stock Availability</dt>
							<dd class="text-foreground mt-0.5">
								{#if prod.quantity !== null && prod.quantity !== undefined}
									{#if prod.quantity > 0}
										<span class="text-emerald-600 font-semibold">{prod.quantity} available in stock</span>
									{:else}
										<span class="text-destructive font-medium">Out of stock</span>
									{/if}
								{:else}
									<span class="text-emerald-600 font-medium">Available</span>
								{/if}
							</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Your Current Balance</dt>
							<dd class="text-foreground font-medium mt-0.5">
								{userWallet} ₳
							</dd>
						</div>

						<div>
							<dt class="text-xs text-muted-foreground font-medium">Category</dt>
							<dd class="text-foreground mt-0.5 capitalize">
								{prod.kind || 'Goodies'}
							</dd>
						</div>
					</dl>
				</div>

				{#if prod.description}
					<div class="space-y-2">
						<h2 class="text-base font-semibold tracking-tight text-foreground">Description</h2>
						<div class="border rounded-md p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
							{prod.description}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
