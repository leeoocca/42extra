<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		heading,
		children,
		...restProps
	}: CommandPrimitive.GroupProps & {
		heading?: string;
	} = $props();
</script>

<CommandPrimitive.Group
	bind:ref
	data-slot="command-group"
	class={cn(
		"text-foreground overflow-hidden p-1 [&_[data-slot=command-group-heading]]:px-2 [&_[data-slot=command-group-heading]]:py-1.5 [&_[data-slot=command-group-heading]]:text-xs [&_[data-slot=command-group-heading]]:font-semibold [&_[data-slot=command-group-heading]]:text-muted-foreground [&_[data-slot=command-group-heading]]:uppercase [&_[data-slot=command-group-heading]]:tracking-wider",
		className
	)}
	{...restProps}
>
	{#if heading}
		<CommandPrimitive.GroupHeading data-slot="command-group-heading">
			{heading}
		</CommandPrimitive.GroupHeading>
	{/if}
	{@render children?.()}
</CommandPrimitive.Group>
