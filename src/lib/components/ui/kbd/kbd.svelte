<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<kbd
	bind:this={ref}
	data-slot="kbd"
	class={cn(
		"bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border px-1.5 font-mono text-[10px] font-medium opacity-100",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</kbd>
