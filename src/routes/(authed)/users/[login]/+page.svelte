<script lang="ts">
	import UserProfileView from '#lib/components/user-profile-view.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#if data.error}
	<div
		class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
	>
		{data.error}
	</div>
{:else if data.userProfile}
	<UserProfileView
		profile={data.userProfile}
		isCurrentUser={false}
		backHref="/clusters"
		backLabel="Back to Clusters"
	/>
{/if}
