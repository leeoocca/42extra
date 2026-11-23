<script lang="ts">
	import DesktopHeader from '#lib/components/desktop-header.svelte';
	import MobileHeader from '#lib/components/mobile-header.svelte';
	import MobileSubnavPills from '#lib/components/mobile-subnav-pills.svelte';
	import MobileDomainSheet from '#lib/components/mobile-domain-sheet.svelte';
	import CommandMenu from '#lib/components/command-menu.svelte';
	import Footer from '#lib/components/footer.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import SearchIcon from '@lucide/svelte/icons/search';

	let { children } = $props();
</script>

<CommandMenu />
<MobileDomainSheet />

<!-- Mobile layout (< 768px, no bottom bar, floating search button) -->
<div class="flex min-h-svh flex-col md:hidden">
	<MobileHeader />
	<MobileSubnavPills />
	<main class="flex-1 p-4 pb-28">
		{@render children()}
	</main>
	<Footer />

	<!-- Mobile Floating Search Button (Bottom Right) -->
	<Button
		size="icon"
		onclick={navState.openCommand}
		class="fixed right-5 bottom-6 z-40 size-12 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
		aria-label="Search or open command palette"
	>
		<SearchIcon class="size-5" />
	</Button>
</div>

<!-- Desktop Centered Layout (>= 768px, no sidebar) -->
<div class="hidden min-h-svh flex-col md:flex">
	<DesktopHeader />
	<main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>
	<Footer />
</div>
