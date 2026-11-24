<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import CoinsIcon from '@lucide/svelte/icons/coins';
	import StoreIcon from '@lucide/svelte/icons/store';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import XCircleIcon from '@lucide/svelte/icons/x-circle';
	import type { PageData } from './$types';
	import type { FtProduct } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');

	let campusName = $derived(data.primaryCampus?.name ?? `Campus #${data.primaryCampusId}`);
	let userWallet = $derived(data.profile?.wallet ?? 0);

	let filteredProducts = $derived.by(() => {
		const list = data.products ?? [];
		const q = searchQuery.trim().toLowerCase();
		if (!q) return list;

		return list.filter((p) => {
			const nameMatch = p.name?.toLowerCase().includes(q);
			const descMatch = p.description?.toLowerCase().includes(q);
			const slugMatch = p.slug?.toLowerCase().includes(q);
			return nameMatch || descMatch || slugMatch;
		});
	});

	function getProductImageUrl(product: FtProduct): string | null {
		if (!product.image?.url || typeof product.image.url !== 'string') return null;
		const rawUrl = product.image.url.startsWith('http')
			? product.image.url
			: `https://cdn.intra.42.fr${product.image.url.replace('/uploads', '')}`;
		return getCdnProxyUrl(rawUrl) ?? null;
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Campus Shop</h1>
				<Badge variant="outline" class="text-xs">
					{campusName}
				</Badge>
			</div>
			<p class="text-xs text-muted-foreground mt-0.5">
				Redeem coalition points and campus tokens for 42 goodies.
			</p>
		</div>

		<div class="flex items-center gap-3">
			<div class="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded-md text-xs font-medium">
				<CoinsIcon class="w-3.5 h-3.5" />
				<span>{userWallet} ₳</span>
			</div>
		</div>
	</div>

	<!-- Search & stats -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
		<div class="relative w-full sm:w-64">
			<SearchIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter products..."
				bind:value={searchQuery}
				class="pl-8 h-8 text-xs"
			/>
		</div>

		<span class="text-xs text-muted-foreground">
			{filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} listed
		</span>
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{data.error}
		</div>
	{/if}

	{#if filteredProducts.length === 0}
		<div class="border rounded-md p-6 text-center text-muted-foreground text-sm space-y-1">
			<p class="font-medium">No products found</p>
			<p class="text-xs">
				{searchQuery ? 'No product matches your filter.' : `No products available right now in ${campusName}.`}
			</p>
		</div>
	{:else}
		<div class="border rounded-md divide-y text-sm">
			{#each filteredProducts as product}
				{@const imageUrl = getProductImageUrl(product)}
				{@const canAfford = userWallet >= product.price}
				<div class="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3">
					<div class="flex items-center gap-3.5 min-w-0">
						{#if imageUrl}
							<img
								src={imageUrl}
								alt={product.name}
								class="w-12 h-12 object-contain rounded border bg-muted/20 shrink-0 p-1"
								loading="lazy"
							/>
						{:else}
							<div class="w-12 h-12 rounded border bg-muted/30 flex items-center justify-center shrink-0 text-muted-foreground">
								<StoreIcon class="w-5 h-5" />
							</div>
						{/if}

						<div class="space-y-0.5 min-w-0">
							<div class="flex items-center gap-2">
								<a
									href={`/shop/${product.id}`}
									class="font-semibold text-base text-foreground hover:underline truncate"
								>
									{product.name}
								</a>
								{#if product.kind}
									<Badge variant="outline" class="text-xs px-2 py-0.5 capitalize">
										{product.kind}
									</Badge>
								{/if}
							</div>

							{#if product.description}
								<p class="text-muted-foreground text-xs line-clamp-1">
									{product.description}
								</p>
							{/if}
						</div>
					</div>

					<div class="flex items-center gap-4 shrink-0 text-right">
						<div>
							<div class="font-bold text-base {canAfford ? 'text-foreground' : 'text-muted-foreground'}">
								{product.price} ₳
							</div>
							<div class="text-xs flex items-center justify-end gap-1 {product.quantity === 0 ? 'text-destructive' : 'text-muted-foreground'}">
								{#if product.quantity !== null && product.quantity !== undefined}
									{#if product.quantity > 0}
										<span>{product.quantity} in stock</span>
									{:else}
										<span>Out of stock</span>
									{/if}
								{:else}
									<span>In stock</span>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
