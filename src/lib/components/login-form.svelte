<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { authClient } from '$lib/client';
	import Button from './ui/button/button.svelte';
	import E from './logos/e.svelte';
	import Ft from './logos/ft.svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	let isLoading = $state(false);

	async function handleSignIn() {
		isLoading = true;
		try {
			await authClient.signIn.oauth2({
				providerId: '42',
				callbackURL: '/'
			});
		} catch (error) {
			console.error('Sign in error:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<div class="flex flex-col items-center gap-2 text-center">
		<div class="flex flex-col items-center gap-2 font-medium">
			<div class="flex size-8 items-center justify-center rounded-md">
				<E class="size-7" />
			</div>
			<span class="sr-only">42extra</span>
		</div>
		<h1 class="text-xl font-bold">42extra</h1>
	</div>
	<Button
		variant="outline"
		class="flex justify-center gap-1"
		onclick={handleSignIn}
		disabled={isLoading}
	>
		{#if isLoading}
			<span>Signing in...</span>
		{:else}
			<span>Sign in with</span>
			<span class="sr-only">42</span>
			<Ft class="size-6" />
		{/if}
	</Button>
</div>
