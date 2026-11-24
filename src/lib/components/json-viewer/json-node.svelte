<script lang="ts">
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import JsonNode from './json-node.svelte';

	let {
		keyName = undefined,
		value,
		depth = 0,
		maxExpandDepth = 2,
		isLast = true
	}: {
		keyName?: string;
		value: unknown;
		depth?: number;
		maxExpandDepth?: number;
		isLast?: boolean;
	} = $props();

	let manualExpanded = $state<boolean | null>(null);
	let isExpanded = $derived(manualExpanded !== null ? manualExpanded : depth < maxExpandDepth);
	let copiedValue = $state(false);

	const valueType = $derived.by<
		'null' | 'undefined' | 'boolean' | 'number' | 'string' | 'array' | 'object'
	>(() => {
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		if (Array.isArray(value)) return 'array';
		const t = typeof value;
		if (t === 'string' || t === 'number' || t === 'boolean') return t;
		return 'object';
	});

	const isCollapsible = $derived(valueType === 'object' || valueType === 'array');

	const entries = $derived.by<[string, unknown][]>(() => {
		if (valueType === 'array') {
			return (value as unknown[]).map((v, i) => [String(i), v]);
		}
		if (valueType === 'object' && value !== null) {
			return Object.entries(value as Record<string, unknown>);
		}
		return [];
	});

	function toggleExpand() {
		if (isCollapsible) {
			manualExpanded = !isExpanded;
		}
	}

	async function copyValue(e: MouseEvent) {
		e.stopPropagation();
		try {
			const str =
				typeof value === 'object' && value !== null
					? JSON.stringify(value, null, 2)
					: String(value);
			await navigator.clipboard.writeText(str);
			copiedValue = true;
			setTimeout(() => {
				copiedValue = false;
			}, 1500);
		} catch (err) {
			console.error('Failed to copy node value:', err);
		}
	}
</script>

<div class="group/node relative font-mono text-xs leading-relaxed select-text">
	<div
		class="-mx-1 inline-flex items-center gap-1.5 rounded px-1 transition-colors hover:bg-muted/40 {isCollapsible
			? 'cursor-pointer select-none'
			: ''}"
		onclick={toggleExpand}
		role={isCollapsible ? 'button' : undefined}
		tabindex={undefined}
		onkeydown={(e) => {
			if (isCollapsible && (e.key === 'Enter' || e.key === ' ')) {
				e.preventDefault();
				toggleExpand();
			}
		}}
	>
		<!-- Chevron for collapsible nodes -->
		{#if isCollapsible}
			<span
				class="inline-flex size-3.5 items-center justify-center text-muted-foreground transition-transform duration-150 {isExpanded
					? 'rotate-90'
					: ''}"
			>
				<ChevronRightIcon class="size-3" />
			</span>
		{:else}
			<span class="inline-block size-3.5"></span>
		{/if}

		<!-- Key name -->
		{#if keyName !== undefined}
			<span class="font-medium text-purple-700 dark:text-purple-300">
				{keyName}:
			</span>
		{/if}

		<!-- Value preview or open bracket -->
		{#if valueType === 'object'}
			<span class="text-muted-foreground">&#123;</span>
			{#if !isExpanded}
				<span
					class="py-0.2 rounded bg-muted/60 px-1 text-[10px] text-muted-foreground tabular-nums"
				>
					{entries.length}
					{entries.length === 1 ? 'key' : 'keys'}
				</span>
				<span class="text-muted-foreground">&#125;</span>
			{/if}
		{:else if valueType === 'array'}
			<span class="text-muted-foreground">[</span>
			{#if !isExpanded}
				<span
					class="py-0.2 rounded bg-muted/60 px-1 text-[10px] text-muted-foreground tabular-nums"
				>
					{entries.length}
					{entries.length === 1 ? 'item' : 'items'}
				</span>
				<span class="text-muted-foreground">]</span>
			{/if}
		{:else if valueType === 'string'}
			<span class="font-normal break-all text-emerald-600 dark:text-emerald-400">"{value}"</span>
		{:else if valueType === 'number'}
			<span class="font-medium text-blue-600 tabular-nums dark:text-blue-400">{value}</span>
		{:else if valueType === 'boolean'}
			<span class="font-semibold text-amber-600 dark:text-amber-400">{String(value)}</span>
		{:else if valueType === 'null'}
			<span class="font-medium text-rose-500 opacity-80">null</span>
		{:else if valueType === 'undefined'}
			<span class="text-muted-foreground opacity-60">undefined</span>
		{/if}

		<!-- Comma suffix if not last item in parent container -->
		{#if !isLast && (!isCollapsible || !isExpanded)}
			<span class="text-muted-foreground/60">,</span>
		{/if}

		<!-- Node quick-copy button on hover -->
		<button
			type="button"
			onclick={copyValue}
			class="ml-1 hidden size-4 items-center justify-center rounded text-muted-foreground transition-colors group-hover/node:inline-flex hover:bg-muted hover:text-foreground"
			title="Copy node value"
			aria-label="Copy node value"
		>
			{#if copiedValue}
				<CheckIcon class="size-2.5 text-emerald-500" />
			{:else}
				<CopyIcon class="size-2.5" />
			{/if}
		</button>
	</div>

	<!-- Children for expanded object or array -->
	{#if isCollapsible && isExpanded}
		<div class="mt-0.5 ml-4 space-y-0.5 border-l border-border/40 pl-2">
			{#each entries as [childKey, childVal], index (childKey)}
				<JsonNode
					keyName={valueType === 'array' ? undefined : childKey}
					value={childVal}
					depth={depth + 1}
					{maxExpandDepth}
					isLast={index === entries.length - 1}
				/>
			{/each}
		</div>
		<div class="ml-4 font-mono text-xs text-muted-foreground select-none">
			{valueType === 'object' ? '}' : ']'}{#if !isLast}<span class="text-muted-foreground/60">
					,
				</span>{/if}
		</div>
	{/if}
</div>
