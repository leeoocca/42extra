<script lang="ts">
	import UserProfileView from '#lib/components/user-profile-view.svelte';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import type { PageData } from './$types';
	import type { FtUserMe } from '#lib/schemas/42.js';
	import { onMount, onDestroy } from 'svelte';

	let { data }: { data: PageData } = $props();

	let isRefreshing = $state(false);
	let refreshError = $state<string | null>(null);
	let customProfile = $state<FtUserMe | null>(null);
	let activeProfile = $derived(customProfile ?? data.profile);

	async function handleRefresh() {
		isRefreshing = true;
		refreshError = null;
		try {
			const res = await fetch('/api/v2/me');
			if (!res.ok) {
				const err = await res.json().catch(() => null);
				throw new Error(err?.message || `Refresh failed (${res.status})`);
			}
			customProfile = (await res.json()) as FtUserMe;
		} catch (err: any) {
			refreshError = err?.message || 'Failed to refresh profile from 42 API';
		} finally {
			isRefreshing = false;
		}
	}

	onMount(() => {
		navState.onRefresh = handleRefresh;
	});

	onDestroy(() => {
		if (navState.onRefresh === handleRefresh) {
			navState.onRefresh = null;
		}
	});
</script>

{#if refreshError || data.error}
	<div
		class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
	>
		{refreshError || data.error}
	</div>
{:else if activeProfile}
	<UserProfileView profile={activeProfile} isCurrentUser={true} />
{/if}
