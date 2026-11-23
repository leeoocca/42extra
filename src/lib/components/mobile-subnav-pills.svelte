<script lang="ts">
	import { page } from '$app/state';
	import { getDomainForPath, isItemActive } from '#lib/config/navigation.js';

	const activeDomain = $derived(getDomainForPath(page.url.pathname));
</script>

{#if activeDomain && activeDomain.items.length > 1}
	<div
		class="sticky top-14 z-30 flex w-full items-center gap-1.5 border-b border-border/70 bg-background/90 px-3 py-2 backdrop-blur-md md:hidden overflow-x-auto no-scrollbar"
	>
		{#each activeDomain.items as item (item.href)}
			{@const active = isItemActive(item.href, page.url.pathname)}
			<a
				href={item.href}
				class="rounded-full px-3 py-1 text-xs font-medium shrink-0 transition-colors {active
					? 'bg-primary text-primary-foreground shadow-xs'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
			>
				<span>{item.title}</span>
			</a>
		{/each}
	</div>
{/if}
