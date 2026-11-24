<script lang="ts">
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '#lib/components/ui/button/index.js';

	let {
		url = '',
		class: className = ''
	}: {
		url: string;
		class?: string;
	} = $props();

	let copied = $state(false);

	interface UrlToken {
		id: string;
		text: string;
		type: 'origin' | 'path' | 'delimiter' | 'key' | 'value' | 'equal';
	}

	const tokens = $derived.by<UrlToken[]>(() => {
		if (!url) return [];
		const result: UrlToken[] = [];

		const qIndex = url.indexOf('?');
		const basePath = qIndex === -1 ? url : url.slice(0, qIndex);
		const queryString = qIndex === -1 ? '' : url.slice(qIndex + 1);

		// Parse base path tokens
		const protocolIdx = basePath.indexOf('://');
		let pathPart = basePath;
		if (protocolIdx !== -1) {
			const afterProtocol = basePath.indexOf('/', protocolIdx + 3);
			if (afterProtocol !== -1) {
				result.push({ id: 'origin', text: basePath.slice(0, afterProtocol), type: 'origin' });
				pathPart = basePath.slice(afterProtocol);
			} else {
				result.push({ id: 'origin', text: basePath, type: 'origin' });
				pathPart = '';
			}
		}

		if (pathPart) {
			result.push({ id: 'path', text: pathPart, type: 'path' });
		}

		if (qIndex !== -1) {
			result.push({ id: 'q-mark', text: '?', type: 'delimiter' });

			if (queryString) {
				const pairs = queryString.split('&');
				pairs.forEach((pair, idx) => {
					if (idx > 0) {
						result.push({ id: `amp-${idx}`, text: '&', type: 'delimiter' });
					}
					const eqIdx = pair.indexOf('=');
					if (eqIdx === -1) {
						result.push({ id: `key-${idx}`, text: pair, type: 'key' });
					} else {
						const key = pair.slice(0, eqIdx);
						const val = pair.slice(eqIdx + 1);
						result.push({ id: `key-${idx}`, text: key, type: 'key' });
						result.push({ id: `eq-${idx}`, text: '=', type: 'equal' });
						result.push({ id: `val-${idx}`, text: decodeURIComponent(val), type: 'value' });
					}
				});
			}
		}

		return result;
	});

	async function copyUrl() {
		if (!url) return;
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 1800);
		} catch (err) {
			console.error('Failed to copy URL:', err);
		}
	}
</script>

<div
	class="group relative flex items-center justify-between gap-2 overflow-hidden rounded-md border border-input bg-muted/30 px-3 py-2 font-mono text-xs select-all {className}"
>
	<div class="flex-1 scrollbar-thin overflow-x-auto whitespace-nowrap">
		{#if tokens.length === 0}
			<span class="text-muted-foreground/60 select-none">No endpoint selected...</span>
		{:else}
			{#each tokens as token (token.id)}
				{#if token.type === 'origin'}
					<span class="text-muted-foreground">{token.text}</span>
				{:else if token.type === 'path'}
					<span class="font-semibold text-foreground">{token.text}</span>
				{:else if token.type === 'delimiter'}
					<span class="font-bold text-muted-foreground/60">{token.text}</span>
				{:else if token.type === 'key'}
					<span class="font-medium text-blue-600 dark:text-blue-400">{token.text}</span>
				{:else if token.type === 'equal'}
					<span class="text-muted-foreground/50">{token.text}</span>
				{:else if token.type === 'value'}
					<span class="font-medium text-amber-600 tabular-nums dark:text-amber-400">
						{token.text}
					</span>
				{/if}
			{/each}
		{/if}
	</div>

	<Button
		variant="ghost"
		size="sm"
		onclick={copyUrl}
		class="h-7 shrink-0 gap-1 px-2 text-[11px] text-muted-foreground hover:text-foreground"
		title="Copy URL"
		aria-label="Copy URL"
	>
		{#if copied}
			<CheckIcon class="size-3 text-emerald-500" />
			<span class="font-medium text-emerald-500">Copied</span>
		{:else}
			<CopyIcon class="size-3" />
			<span>Copy</span>
		{/if}
	</Button>
</div>
