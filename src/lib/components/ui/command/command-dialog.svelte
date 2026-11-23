<script lang="ts">
	import * as Dialog from "#lib/components/ui/dialog/index.js";
	import Command from "./command.svelte";
	import type { Dialog as DialogPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";

	let {
		open = $bindable(false),
		children,
		portalProps,
		...restProps
	}: DialogPrimitive.RootProps & {
		children: Snippet;
		portalProps?: DialogPrimitive.PortalProps;
	} = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Content class="overflow-hidden p-0 shadow-2xl" showCloseButton={false} {portalProps}>
		<Command class="[&_[data-slot=command-input-wrapper]_svg]:size-5 [&_[data-slot=command-input-wrapper]]:h-12 [&_[data-slot=command-item]]:px-2 [&_[data-slot=command-item]]:py-2 [&_[data-slot=command-item]_svg]:size-5">
			{@render children?.()}
		</Command>
	</Dialog.Content>
</Dialog.Root>
