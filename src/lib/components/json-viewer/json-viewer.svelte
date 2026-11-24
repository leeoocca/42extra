<script lang="ts">
	import JsonNode from './json-node.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import ChevronsDownUpIcon from '@lucide/svelte/icons/chevrons-down-up';
	import CodeIcon from '@lucide/svelte/icons/code';
	import ListTreeIcon from '@lucide/svelte/icons/list-tree';

	let {
		data,
		class: className = ''
	}: {
		data: unknown;
		class?: string;
	} = $props();

	let maxExpandDepth = $state(2);
	let copiedAll = $state(false);
	let viewMode = $state<'tree' | 'raw'>('tree');

	const formattedJson = $derived(JSON.stringify(data, null, 2));

	const dataSizeLabel = $derived.by(() => {
		try {
			const bytes = new Blob([formattedJson]).size;
			if (bytes < 1024) return `${bytes} B`;
			return `${(bytes / 1024).toFixed(1)} KB`;
		} catch {
			return '';
		}
	});

	const itemCountLabel = $derived.by(() => {
		if (Array.isArray(data)) {
			return `${data.length} items`;
		}
		if (typeof data === 'object' && data !== null) {
			return `${Object.keys(data).length} properties`;
		}
		return typeof data;
	});

	function expandAll() {
		maxExpandDepth = 999;
	}

	function collapseAll() {
		maxExpandDepth = 0;
	}

	function setDepth(depth: number) {
		maxExpandDepth = depth;
	}

	async function copyFullJson() {
		try {
			await navigator.clipboard.writeText(formattedJson);
			copiedAll = true;
			setTimeout(() => {
				copiedAll = false;
			}, 1800);
		} catch (err) {
			console.error('Failed to copy full JSON:', err);
		}
	}
</script>

<div class="flex flex-col rounded-lg border border-border bg-background {className}">
	<!-- Viewer Controls Bar -->
	<div
		class="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/20 px-3 py-2 text-xs"
	>
		<!-- Summary Info -->
		<div class="flex items-center gap-2 text-muted-foreground">
			<span class="font-medium text-foreground">{itemCountLabel}</span>
			<span>•</span>
			<span class="tabular-nums">{dataSizeLabel}</span>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-wrap items-center gap-1.5">
			<!-- Expand/Collapse controls (Tree mode only) -->
			{#if viewMode === 'tree'}
				<div
					class="flex items-center gap-1 rounded-md border border-border/50 bg-muted/40 p-0.5 text-[11px]"
				>
					<button
						type="button"
						onclick={collapseAll}
						class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
						title="Collapse all levels"
					>
						<ChevronsDownUpIcon class="size-3" />
						<span>Collapse</span>
					</button>
					<button
						type="button"
						onclick={() => setDepth(1)}
						class="rounded px-1.5 py-0.5 text-muted-foreground tabular-nums transition-colors hover:bg-background hover:text-foreground {maxExpandDepth ===
						1
							? 'bg-background font-semibold text-foreground'
							: ''}"
						title="Expand 1 level"
					>
						L1
					</button>
					<button
						type="button"
						onclick={() => setDepth(2)}
						class="rounded px-1.5 py-0.5 text-muted-foreground tabular-nums transition-colors hover:bg-background hover:text-foreground {maxExpandDepth ===
						2
							? 'bg-background font-semibold text-foreground'
							: ''}"
						title="Expand 2 levels"
					>
						L2
					</button>
					<button
						type="button"
						onclick={expandAll}
						class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground {maxExpandDepth >=
						999
							? 'bg-background font-semibold text-foreground'
							: ''}"
						title="Expand all levels"
					>
						<ChevronsUpDownIcon class="size-3" />
						<span>Expand</span>
					</button>
				</div>
			{/if}

			<!-- View Mode Toggle (Tree / Raw) -->
			<Button
				variant="outline"
				size="sm"
				class="h-7 gap-1 px-2.5 text-xs"
				onclick={() => (viewMode = viewMode === 'tree' ? 'raw' : 'tree')}
				title={viewMode === 'tree' ? 'View formatted raw JSON' : 'View interactive tree'}
			>
				{#if viewMode === 'tree'}
					<CodeIcon class="size-3.5 text-muted-foreground" />
					<span>Raw</span>
				{:else}
					<ListTreeIcon class="size-3.5 text-muted-foreground" />
					<span>Tree</span>
				{/if}
			</Button>

			<!-- Copy Full JSON Button -->
			<Button
				variant="outline"
				size="sm"
				class="h-7 gap-1 px-2.5 text-xs"
				onclick={copyFullJson}
				title="Copy formatted JSON to clipboard"
			>
				{#if copiedAll}
					<CheckIcon class="size-3.5 text-emerald-500" />
					<span class="font-medium text-emerald-500">Copied</span>
				{:else}
					<CopyIcon class="size-3.5" />
					<span>Copy JSON</span>
				{/if}
			</Button>
		</div>
	</div>

	<!-- Content Area -->
	<div class="max-h-[650px] min-h-[160px] overflow-auto p-4">
		{#if viewMode === 'tree'}
			<div class="space-y-0.5">
				<JsonNode value={data} depth={0} {maxExpandDepth} isLast={true} />
			</div>
		{:else}
			<pre class="font-mono text-xs leading-relaxed whitespace-pre text-foreground select-all"><code
					>{formattedJson}</code
				></pre>
		{/if}
	</div>
</div>
