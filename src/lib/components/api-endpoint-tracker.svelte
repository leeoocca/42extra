<script lang="ts">
	import {
		subscribeTrackedEndpoints,
		refreshEndpoint,
		refreshAll,
		type TrackedEndpoint
	} from '$lib/api';
	import Button from '$lib/components/ui/button/button.svelte';
	import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
	import { Spinner } from './ui/spinner';
	import { invalidate } from '$app/navigation';

	let endpoints = $state<TrackedEndpoint[]>([]);
	let refreshing = $state(new Set<string>());
	let refreshingAll = $state(false);

	// Get color for status code
	function getStatusColor(status: number): string {
		if (status === 0) {
			return 'bg-purple-700 text-purple-100'; // Pending
		} else if (status >= 200 && status < 300) {
			return 'bg-green-700 text-green-100';
		} else if (status >= 300 && status < 400) {
			return 'bg-blue-700 text-blue-100';
		} else if (status >= 400 && status < 500) {
			return 'bg-yellow-700 text-yellow-100';
		} else if (status >= 500) {
			return 'bg-red-700 text-red-100';
		}
		return 'bg-gray-700 text-gray-100';
	}

	// Subscribe to tracked endpoints store
	const unsubscribe = subscribeTrackedEndpoints((newEndpoints) => {
		endpoints = newEndpoints;
	});

	// Cleanup subscription on destroy
	$effect.root(() => {
		return () => unsubscribe();
	});

	async function handleRefreshAll() {
		refreshingAll = true;
		try {
			refreshAll();
			// Invalidate all endpoints to refetch them
			await invalidate(() => true);
		} finally {
			refreshingAll = false;
		}
	}

	async function handleRefreshEndpoint(endpoint: string) {
		refreshing.add(endpoint);
		try {
			// Clear cache for this specific endpoint (pass display form)
			refreshEndpoint(endpoint);
			// Invalidate all load data to refetch
			await invalidate(() => true);
		} finally {
			refreshing.delete(endpoint);
		}
	}
</script>

<div class="space-y-2 border-t p-2">
	<div class="text-xs font-semibold text-muted-foreground">API Endpoints ({endpoints.length})</div>

	{#if endpoints.length === 0}
		<div class="text-xs text-muted-foreground italic">No endpoints called</div>
	{:else}
		<div class="max-h-40 space-y-1 overflow-y-auto">
			{#each endpoints as endpoint (endpoint.name)}
				<div class="flex items-center justify-between gap-1 rounded py-1 text-xs">
					<Button
						size="sm"
						variant="ghost"
						disabled={refreshing.has(endpoint.name)}
						onclick={() => handleRefreshEndpoint(endpoint.name)}
						class="p-0.5"
					>
						{#if refreshing.has(endpoint.name)}
							<Spinner />
						{:else}
							<RotateCwIcon class="size-3" />
						{/if}
					</Button>
					<span class="flex-1 truncate font-mono text-muted-foreground">{endpoint.name}</span>
					<span class="rounded px-1.5 py-0.5 font-semibold {getStatusColor(endpoint.status)}">
						{#if endpoint.status === 0}
							<Spinner />
						{:else}{endpoint.status}
						{/if}
					</span>
				</div>
			{/each}
		</div>
		<Button
			size="sm"
			variant="ghost"
			class="h-8 w-full text-xs"
			disabled={refreshingAll}
			onclick={handleRefreshAll}
		>
			{#if refreshingAll}
				<Spinner />
			{/if}
			Refresh All
		</Button>
	{/if}
</div>
