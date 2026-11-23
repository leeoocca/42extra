<script lang="ts">
	import E from './logos/e.svelte';
	import { page } from '$app/state';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import { getDomainForPath } from '#lib/config/navigation.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Button } from '#lib/components/ui/button/index.js';

	const activeDomain = $derived(getDomainForPath(page.url.pathname));
</script>

<header
	class="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md md:hidden"
>
	<div class="flex items-center gap-2">
		<a href="/" class="flex items-center gap-2 font-semibold">
			<div
				class="flex aspect-square size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"
			>
				<E class="size-3.5" />
			</div>
			<span class="text-sm font-bold tracking-tight">42extra</span>
		</a>

		<span class="text-muted-foreground/40">/</span>
		<Button
			variant="ghost"
			size="sm"
			onclick={() => navState.openDomainSheet(activeDomain)}
			class="h-7 px-2 text-xs font-medium"
			aria-label="Open navigation drawer"
		>
			<span>{activeDomain?.title ?? 'Home'}</span>
		</Button>
	</div>

	<div class="flex items-center">
		<a href="/me" class="block cursor-pointer" aria-label="Your profile">
			<Avatar.Root class="size-8 rounded-lg border border-border">
				<Avatar.Image
					src={page.data.user?.image}
					alt={page.data.user?.name ?? 'User'}
					class="object-cover"
				/>
				<Avatar.Fallback class="text-xs font-semibold">42</Avatar.Fallback>
			</Avatar.Root>
		</a>
	</div>
</header>
