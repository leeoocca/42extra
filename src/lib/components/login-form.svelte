<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { SignIn } from '@auth/sveltekit/components';
	import { buttonVariants } from './ui/button/button.svelte';
	import E from './logos/e.svelte';
	import Ft from './logos/ft.svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
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
	<SignIn provider="42-school" className="flex justify-center">
		<div
			slot="submitButton"
			class={cn(buttonVariants({ variant: 'outline' }), 'cursor-pointer gap-1')}
		>
			Sign in with <span class="sr-only">42</span>
			<Ft class="size-6" />
		</div>
	</SignIn>
</div>
