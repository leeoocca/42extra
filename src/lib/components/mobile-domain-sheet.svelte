<script lang="ts">
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { NAV_DOMAINS, isDomainActive, type NavDomain } from '#lib/config/navigation.js';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	function selectDomain(domain: NavDomain) {
		navState.closeDomainSheet();
		goto(domain.defaultHref);
	}
</script>

<Sheet.Root
	bind:open={() => navState.isDomainSheetOpen, (v) => (navState.isDomainSheetOpen = v)}
>
	<Sheet.Content
		side="bottom"
		class="max-h-[85vh] rounded-t-2xl p-0 pb-6 outline-none"
	>
		<Sheet.Header class="border-b border-border p-4 pb-3">
			<div class="mx-auto mb-2 h-1 w-12 rounded-full bg-muted-foreground/30"></div>
			<Sheet.Title class="text-center text-base font-bold">Navigation</Sheet.Title>
			<Sheet.Description class="sr-only">Select a navigation destination</Sheet.Description>
		</Sheet.Header>

		<!-- Domains list (only domains, no icons) -->
		<div class="p-4 space-y-2">
			{#each NAV_DOMAINS as domain (domain.id)}
				{@const active = isDomainActive(domain, page.url.pathname)}
				<Button
					variant={active ? 'secondary' : 'outline'}
					onclick={() => selectDomain(domain)}
					class="h-auto w-full justify-between p-3.5 text-sm {active ? 'font-semibold border-primary/40' : 'font-normal'}"
				>
					<span>{domain.title}</span>
					{#if active}
						<Badge variant="default" class="text-[11px]">Active</Badge>
					{/if}
				</Button>
			{/each}
		</div>
	</Sheet.Content>
</Sheet.Root>
