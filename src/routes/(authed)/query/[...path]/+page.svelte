<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { page } from '$app/state';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import JsonViewer from '#lib/components/json-viewer/json-viewer.svelte';
	import UrlHighlighter from '#lib/components/url-highlighter.svelte';
	import PlayIcon from '@lucide/svelte/icons/play';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import InfoIcon from '@lucide/svelte/icons/info';
	import ClockIcon from '@lucide/svelte/icons/clock';

	interface QueryParam {
		id: string;
		key: string;
		value: string;
		enabled: boolean;
	}

	interface PresetEndpoint {
		label: string;
		endpoint: string;
		params: { key: string; value: string }[];
	}

	const PRESETS: PresetEndpoint[] = [
		{
			label: 'My Profile',
			endpoint: 'me',
			params: []
		},
		{
			label: 'Campuses',
			endpoint: 'campus',
			params: [
				{ key: 'page[size]', value: '10' },
				{ key: 'sort', value: 'name' }
			]
		},
		{
			label: 'Projects',
			endpoint: 'projects',
			params: [
				{ key: 'page[size]', value: '15' },
				{ key: 'sort', value: '-created_at' }
			]
		},
		{
			label: 'Users',
			endpoint: 'users',
			params: [
				{ key: 'page[size]', value: '10' },
				{ key: 'sort', value: 'login' }
			]
		},
		{
			label: 'Events',
			endpoint: 'events',
			params: [
				{ key: 'page[size]', value: '10' },
				{ key: 'sort', value: '-begin_at' }
			]
		},
		{
			label: 'Cursus',
			endpoint: 'cursus',
			params: [{ key: 'page[size]', value: '10' }]
		},
		{
			label: 'Evaluation Slots',
			endpoint: 'slots',
			params: [{ key: 'page[size]', value: '10' }]
		}
	];

	// Initialize endpoint and params from page data or fallback defaults
	let endpoint = $state(page.data.initialEndpoint || 'campus');

	const initialLoadedParams: QueryParam[] =
		page.data.initialParams && page.data.initialParams.length > 0
			? page.data.initialParams.map((p: { key: string; value: string }, idx: number) => ({
					id: String(idx + 1),
					key: p.key,
					value: p.value,
					enabled: true
				}))
			: [
					{ id: '1', key: 'page[size]', value: '10', enabled: true },
					{ id: '2', key: 'page[number]', value: '1', enabled: true }
				];

	let params = $state<QueryParam[]>(initialLoadedParams);

	let isLoading = $state(false);
	let responseData = $state<unknown>(null);
	let responseStatus = $state<number | null>(null);
	let responseStatusText = $state<string>('');
	let responseTimeMs = $state<number | null>(null);
	let responseHeaders = $state<{ name: string; value: string }[]>([]);
	let errorMessage = $state<string | null>(null);
	let showHeaders = $state(false);

	// Derived Pagination State from headers and params
	const paginationInfo = $derived.by(() => {
		const pageHeader = responseHeaders.find((h) => h.name.toLowerCase() === 'x-page')?.value;
		const perPageHeader = responseHeaders.find((h) => h.name.toLowerCase() === 'x-per-page')?.value;
		const totalHeader = responseHeaders.find((h) => h.name.toLowerCase() === 'x-total')?.value;
		const linkHeader = responseHeaders.find((h) => h.name.toLowerCase() === 'link')?.value;

		const pageParam = params.find((p) => p.key === 'page[number]' && p.enabled)?.value;
		const perPageParam = params.find((p) => p.key === 'page[size]' && p.enabled)?.value;

		const currentPage = pageHeader
			? parseInt(pageHeader, 10)
			: pageParam
				? parseInt(pageParam, 10)
				: 1;
		const perPage = perPageHeader
			? parseInt(perPageHeader, 10)
			: perPageParam
				? parseInt(perPageParam, 10)
				: 30;
		const total = totalHeader ? parseInt(totalHeader, 10) : null;
		const totalPages = total !== null ? Math.max(1, Math.ceil(total / perPage)) : null;

		const hasNext =
			totalPages !== null ? currentPage < totalPages : Boolean(linkHeader?.includes('rel="next"'));
		const hasPrev = currentPage > 1;

		return {
			currentPage,
			perPage,
			total,
			totalPages,
			hasNext,
			hasPrev
		};
	});

	// Construct clean endpoint (strip any leading slashes or /v2/)
	const cleanEndpoint = $derived.by(() => {
		let ep = endpoint.trim();
		if (ep.startsWith('/v2/')) ep = ep.slice(4);
		else if (ep.startsWith('v2/')) ep = ep.slice(3);
		else if (ep.startsWith('/')) ep = ep.slice(1);
		return ep;
	});

	const queryString = $derived.by(() => {
		const activeParams = params.filter((p) => p.enabled && p.key.trim().length > 0);
		if (activeParams.length === 0) return '';
		const searchParams = new SvelteURLSearchParams();
		for (const p of activeParams) {
			searchParams.append(p.key.trim(), p.value.trim());
		}
		return searchParams.toString();
	});

	const finalFetchUrl = $derived.by(() => {
		const base = `/api/v2/${cleanEndpoint}`;
		return queryString ? `${base}?${queryString}` : base;
	});

	const upstreamApiUrl = $derived.by(() => {
		const base = `https://api.intra.42.fr/v2/${cleanEndpoint}`;
		return queryString ? `${base}?${queryString}` : base;
	});

	/**
	 * Synchronize the current endpoint path and query parameters into the browser's address bar.
	 * Format: /query/<cleanEndpoint>?key=val (e.g. /query/campus?page[size]=10&sort=name)
	 * This cleanly avoids parameter collision where an actual API query param "endpoint"
	 * would clash with the router parameter.
	 */
	function syncStateToUrl() {
		if (typeof window === 'undefined') return;

		const targetPath = cleanEndpoint ? `/query/${cleanEndpoint}` : '/query';
		const nextSearch = queryString ? `?${queryString}` : '';
		const nextRelativeUrl = `${targetPath}${nextSearch}`;

		if (window.location.pathname + window.location.search !== nextRelativeUrl) {
			window.history.replaceState(null, '', nextRelativeUrl);
		}
	}

	function addParam() {
		params.push({
			id: String(Date.now() + Math.random()),
			key: '',
			value: '',
			enabled: true
		});
		syncStateToUrl();
	}

	function removeParam(id: string) {
		params = params.filter((p) => p.id !== id);
		syncStateToUrl();
	}

	function applyPreset(preset: PresetEndpoint) {
		endpoint = preset.endpoint;
		params = [
			...preset.params.map((p, i) => ({
				id: String(Date.now() + i),
				key: p.key,
				value: p.value,
				enabled: true
			})),
			// Ensure page[number] is available if preset has page[size]
			...(preset.params.some((p) => p.key === 'page[size]')
				? [{ id: String(Date.now() + 99), key: 'page[number]', value: '1', enabled: true }]
				: [])
		];
		syncStateToUrl();
		executeFetch();
	}

	function updatePageNumber(newPage: number) {
		const pageParamIndex = params.findIndex((p) => p.key === 'page[number]');
		if (pageParamIndex !== -1) {
			params[pageParamIndex].value = String(newPage);
			params[pageParamIndex].enabled = true;
		} else {
			params.push({
				id: String(Date.now()),
				key: 'page[number]',
				value: String(newPage),
				enabled: true
			});
		}
		syncStateToUrl();
		executeFetch();
	}

	async function executeFetch() {
		if (!cleanEndpoint) return;
		syncStateToUrl();
		isLoading = true;
		errorMessage = null;

		const startTime = performance.now();

		try {
			const res = await fetch(finalFetchUrl);
			responseTimeMs = Math.round(performance.now() - startTime);
			responseStatus = res.status;
			responseStatusText = res.statusText;

			// Extract forwarded headers
			const headersList: { name: string; value: string }[] = [];
			res.headers.forEach((val, key) => {
				headersList.push({ name: key, value: val });
			});
			responseHeaders = headersList;

			if (!res.ok) {
				const errorText = await res.text();
				try {
					responseData = JSON.parse(errorText);
				} catch {
					responseData = { error: errorText || `HTTP ${res.status} ${res.statusText}` };
				}
				errorMessage = `Request returned HTTP ${res.status} ${res.statusText}`;
				return;
			}

			const json: unknown = await res.json();
			responseData = json;
		} catch (err: unknown) {
			responseTimeMs = Math.round(performance.now() - startTime);
			responseStatus = 500;
			responseStatusText = 'Client Error';
			errorMessage = err instanceof Error ? err.message : 'Failed to communicate with 42 API proxy';
			responseData = null;
		} finally {
			isLoading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			executeFetch();
		}
	}

	onMount(() => {
		// Sync URL on initial mount and fetch
		syncStateToUrl();
		executeFetch();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Query</h1>
	</div>

	<!-- Presets Badges -->
	<div class="flex flex-wrap items-center gap-1.5 text-xs">
		<span class="mr-1 font-medium text-muted-foreground">Quick Presets:</span>
		{#each PRESETS as preset (preset.endpoint)}
			<Button
				variant="outline"
				size="sm"
				class="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
				onclick={() => applyPreset(preset)}
			>
				{preset.label}
			</Button>
		{/each}
	</div>

	<!-- Request Builder Box -->
	<div class="space-y-4 rounded-lg border border-border bg-card p-4">
		<!-- Endpoint Input Bar -->
		<div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
			<div
				class="flex shrink-0 items-center rounded-md border border-input bg-muted/40 px-3 py-1.5 font-mono text-xs font-medium text-muted-foreground select-none"
			>
				GET /v2/
			</div>
			<div class="relative flex-1">
				<Input
					bind:value={endpoint}
					oninput={syncStateToUrl}
					placeholder="endpoint (e.g. users, campus, projects, me, cursus_users)..."
					class="h-9 font-mono text-xs"
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							executeFetch();
						}
					}}
				/>
			</div>
			<Button
				onclick={executeFetch}
				disabled={isLoading || !cleanEndpoint}
				class="h-9 shrink-0 gap-1.5 px-4 text-xs font-semibold"
			>
				{#if isLoading}
					<RefreshCwIcon class="size-3.5 animate-spin" />
					<span>Fetching...</span>
				{:else}
					<PlayIcon class="size-3.5" />
					<span>Send (⌘↵)</span>
				{/if}
			</Button>
		</div>

		<!-- Query Parameters Section -->
		<div class="space-y-2 border-t border-border/40 pt-1">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-muted-foreground">Query Parameters</span>
				<Button variant="ghost" size="sm" onclick={addParam} class="h-6 gap-1 px-2 text-[11px]">
					<PlusIcon class="size-3" />
					<span>Add Parameter</span>
				</Button>
			</div>

			{#if params.length > 0}
				<div class="space-y-1.5">
					{#each params as param (param.id)}
						<div class="flex items-center gap-2">
							<input
								type="checkbox"
								bind:checked={param.enabled}
								onchange={syncStateToUrl}
								class="size-3.5 cursor-pointer rounded border-input accent-primary"
								title="Enable/disable parameter"
							/>
							<Input
								bind:value={param.key}
								oninput={syncStateToUrl}
								placeholder="key (e.g. filter[primary], page[size])"
								class="h-7 flex-1 font-mono text-xs"
							/>
							<span class="font-mono text-xs text-muted-foreground">=</span>
							<Input
								bind:value={param.value}
								oninput={syncStateToUrl}
								placeholder="value"
								class="h-7 flex-1 font-mono text-xs"
							/>
							<Button
								variant="ghost"
								size="icon"
								class="size-7 text-muted-foreground hover:text-destructive"
								onclick={() => removeParam(param.id)}
								title="Delete parameter"
								aria-label="Delete parameter"
							>
								<Trash2Icon class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Syntax-Highlighted Readonly Final URL -->
		<div class="space-y-1 border-t border-border/40 pt-1">
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<span class="font-medium">Final Upstream URL:</span>
			</div>
			<UrlHighlighter url={upstreamApiUrl} />
		</div>
	</div>

	<!-- Response Header / Status Bar -->
	{#if responseStatus !== null}
		<div
			class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-4 py-2.5 text-xs"
		>
			<div class="flex items-center gap-3">
				<!-- Status Badge -->
				<Badge
					variant={responseStatus >= 200 && responseStatus < 300 ? 'default' : 'destructive'}
					class="px-2 py-0.5 text-xs font-semibold tabular-nums"
				>
					{responseStatus}
					{responseStatusText}
				</Badge>

				<!-- Response Time -->
				{#if responseTimeMs !== null}
					<div class="flex items-center gap-1 text-muted-foreground">
						<ClockIcon class="size-3.5" />
						<span class="font-mono tabular-nums">{responseTimeMs}ms</span>
					</div>
				{/if}
			</div>

			<!-- Response Headers Toggle -->
			<div class="flex items-center gap-2">
				{#if responseHeaders.length > 0}
					<Button
						variant="ghost"
						size="sm"
						class="h-7 text-xs text-muted-foreground hover:text-foreground"
						onclick={() => (showHeaders = !showHeaders)}
					>
						<InfoIcon class="mr-1 size-3" />
						<span>{showHeaders ? 'Hide Headers' : 'View Headers'} ({responseHeaders.length})</span>
					</Button>
				{/if}
			</div>
		</div>

		<!-- Response Headers Drawer/Panel -->
		{#if showHeaders && responseHeaders.length > 0}
			<div class="rounded-md border border-border bg-muted/30 p-3 font-mono text-xs">
				<div class="mb-2 font-semibold text-foreground">Response Headers</div>
				<div class="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
					{#each responseHeaders as h (h.name)}
						<div class="flex items-start justify-between gap-2 border-b border-border/30 pb-0.5">
							<span class="shrink-0 font-medium text-purple-600 dark:text-purple-400">
								{h.name}:
							</span>
							<span class="text-right font-normal break-all text-muted-foreground">{h.value}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}

	<!-- Pagination Bar -->
	{#if responseData !== null && (paginationInfo.totalPages !== null || paginationInfo.hasNext || paginationInfo.hasPrev)}
		<div
			class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-3 text-xs"
		>
			<div class="flex items-center gap-2 text-muted-foreground">
				<span class="font-medium text-foreground">Pagination:</span>
				<span>Page</span>
				<span class="font-semibold text-foreground tabular-nums">{paginationInfo.currentPage}</span>
				{#if paginationInfo.totalPages !== null}
					<span>of</span>
					<span class="font-semibold text-foreground tabular-nums">
						{paginationInfo.totalPages}
					</span>
				{/if}
				{#if paginationInfo.total !== null}
					<span>
						(Total items: <span class="font-semibold text-foreground tabular-nums">
							{paginationInfo.total}
						</span>)
					</span>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					class="h-7 gap-1 px-2.5 text-xs"
					disabled={!paginationInfo.hasPrev || isLoading}
					onclick={() => updatePageNumber(paginationInfo.currentPage - 1)}
				>
					<ChevronLeftIcon class="size-3.5" />
					<span>Previous</span>
				</Button>

				<Button
					variant="outline"
					size="sm"
					class="h-7 gap-1 px-2.5 text-xs"
					disabled={!paginationInfo.hasNext || isLoading}
					onclick={() => updatePageNumber(paginationInfo.currentPage + 1)}
				>
					<span>Next Page</span>
					<ChevronRightIcon class="size-3.5" />
				</Button>
			</div>
		</div>
	{/if}

	<!-- Error Alert if any -->
	{#if errorMessage}
		<div
			class="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{errorMessage}
		</div>
	{/if}

	<!-- Collapsible JSON Viewer -->
	{#if responseData !== null}
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<span class="font-semibold text-foreground">Response Payload</span>
			</div>
			<JsonViewer data={responseData} />
		</div>
	{/if}
</div>
