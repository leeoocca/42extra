<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { friendsStore } from '#lib/state/friends.svelte.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import UsersIcon from '@lucide/svelte/icons/users';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import UserMinusIcon from '@lucide/svelte/icons/user-minus';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { onMount } from 'svelte';

	interface FriendUser {
		id: number;
		login: string;
		displayname?: string | null;
		usual_full_name?: string | null;
		image?: {
			link?: string | null;
			versions?: { small?: string | null; medium?: string | null; large?: string | null };
		} | null;
		location?: string | null;
		'staff?'?: boolean;
		pool_month?: string | null;
		pool_year?: string | null;
	}

	let friendUsers = $state<FriendUser[]>([]);
	let isLoading = $state(false);
	let errorMsg = $state<string | null>(null);
	let importError = $state<string | null>(null);
	let importSuccess = $state<string | null>(null);
	let fileInputRef = $state<HTMLInputElement | null>(null);

	// Add friend by login/id input
	let addInput = $state('');
	let isAdding = $state(false);
	let addError = $state<string | null>(null);

	// Filter query for loaded friends
	let searchQuery = $state('');

	async function fetchFriendDetails() {
		const currentIds = friendsStore.ids;
		if (currentIds.length === 0) {
			friendUsers = [];
			return;
		}

		isLoading = true;
		errorMsg = null;

		try {
			// Fetch users in chunks if necessary (e.g. filter[id]=1,2,3)
			// Upstream 42 API accepts filter[id]=id1,id2,...
			const chunks: number[][] = [];
			for (let i = 0; i < currentIds.length; i += 50) {
				chunks.push(currentIds.slice(i, i + 50));
			}

			const fetched: FriendUser[] = [];
			for (const chunk of chunks) {
				const res = await fetch(`/api/v2/users?filter[id]=${chunk.join(',')}&page[size]=100`);
				if (res.ok) {
					const data = await res.json();
					if (Array.isArray(data)) {
						fetched.push(...data);
					}
				}
			}

			// Sort by login
			fetched.sort((a, b) => a.login.localeCompare(b.login));
			friendUsers = fetched;
		} catch (err: unknown) {
			errorMsg = err instanceof Error ? err.message : 'Failed to fetch friend profiles';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchFriendDetails();
	});

	$effect(() => {
		navState.onRefresh = fetchFriendDetails;
		return () => {
			navState.onRefresh = null;
		};
	});

	async function handleAddFriend(e?: Event) {
		if (e) e.preventDefault();
		const val = addInput.trim().toLowerCase();
		if (!val) return;

		isAdding = true;
		addError = null;

		try {
			// Check if numeric ID
			const num = parseInt(val, 10);
			if (!isNaN(num) && Number.isInteger(num) && String(num) === val) {
				if (friendsStore.isFriend(num)) {
					addError = `User ID ${num} is already in your friends list`;
					return;
				}
				friendsStore.addFriend(num);
				addInput = '';
				await fetchFriendDetails();
				return;
			}

			// Lookup user by login
			const res = await fetch(`/api/v2/users/${val}`);
			if (!res.ok) {
				addError = `User "${val}" not found`;
				return;
			}

			const user = await res.json();
			if (!user?.id) {
				addError = `Unable to resolve user ID for "${val}"`;
				return;
			}

			if (friendsStore.isFriend(user.id)) {
				addError = `${user.login} is already in your friends list`;
				return;
			}

			friendsStore.addFriend(user.id);
			addInput = '';
			await fetchFriendDetails();
		} catch (err: unknown) {
			addError = err instanceof Error ? err.message : 'Error adding friend';
		} finally {
			isAdding = false;
		}
	}

	function handleRemoveFriend(id: number) {
		friendsStore.removeFriend(id);
		friendUsers = friendUsers.filter((u) => u.id !== id);
	}

	function handleExport() {
		friendsStore.downloadJson();
	}

	function triggerImport() {
		importError = null;
		importSuccess = null;
		fileInputRef?.click();
	}

	async function handleFileSelected(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const res = friendsStore.importJson(text, false);
			if (res.success) {
				importSuccess = `Successfully imported ${res.count} friend ID${res.count === 1 ? '' : 's'}.`;
				await fetchFriendDetails();
			} else {
				importError = res.error || 'Failed to import JSON file';
			}
		} catch (err: unknown) {
			importError = err instanceof Error ? err.message : 'Failed to read file';
		} finally {
			target.value = '';
		}
	}

	let filteredFriends = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return friendUsers;

		return friendUsers.filter((u) => {
			const loginMatch = u.login?.toLowerCase().includes(q);
			const nameMatch = u.displayname?.toLowerCase().includes(q) || u.usual_full_name?.toLowerCase().includes(q);
			const locMatch = u.location?.toLowerCase().includes(q);
			return loginMatch || nameMatch || locMatch;
		});
	});
</script>

<!-- Hidden file input for import -->
<input
	type="file"
	accept=".json,application/json"
	bind:this={fileInputRef}
	onchange={handleFileSelected}
	class="hidden"
/>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Friends</h1>
				<Badge variant="outline" class="text-xs px-2 py-0.5">
					{friendsStore.ids.length} saved
				</Badge>
			</div>
		</div>

		<!-- Action buttons -->
		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" class="gap-1.5 h-8 text-xs" onclick={triggerImport}>
				<UploadIcon class="w-3.5 h-3.5" />
				<span>Import JSON</span>
			</Button>

			<Button
				variant="outline"
				size="sm"
				class="gap-1.5 h-8 text-xs"
				disabled={friendsStore.ids.length === 0}
				onclick={handleExport}
			>
				<DownloadIcon class="w-3.5 h-3.5" />
				<span>Export JSON</span>
			</Button>
		</div>
	</div>

	<!-- Status / Import feedback alerts -->
	{#if importSuccess}
		<div class="border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md p-3 text-xs flex items-center justify-between">
			<span>{importSuccess}</span>
			<Button variant="ghost" size="sm" class="h-6 px-2 text-xs" onclick={() => (importSuccess = null)}>
				Dismiss
			</Button>
		</div>
	{/if}

	{#if importError}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs flex items-center justify-between">
			<span>{importError}</span>
			<Button variant="ghost" size="sm" class="h-6 px-2 text-xs" onclick={() => (importError = null)}>
				Dismiss
			</Button>
		</div>
	{/if}

	<!-- Add Friend Bar -->
	<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
		<form onsubmit={handleAddFriend} class="flex gap-2 flex-1 max-w-md">
			<div class="relative flex-1">
				<UserPlusIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Add friend by login (e.g. raveriss) or ID..."
					bind:value={addInput}
					class="pl-8 h-8 text-xs"
				/>
			</div>
			<Button type="submit" size="sm" class="h-8 text-xs px-3" disabled={isAdding || !addInput.trim()}>
				{isAdding ? 'Adding...' : 'Add Friend'}
			</Button>
		</form>

		{#if friendsStore.ids.length > 0}
			<div class="relative w-full sm:w-64">
				<SearchIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Filter saved friends..."
					bind:value={searchQuery}
					class="pl-8 h-8 text-xs"
				/>
			</div>
		{/if}
	</div>

	{#if addError}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{addError}
		</div>
	{/if}

	{#if errorMsg}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{errorMsg}
		</div>
	{/if}

	<!-- Friend List -->
	{#if friendsStore.ids.length === 0}
		<div class="border rounded-md p-8 text-center text-muted-foreground text-sm space-y-2">
			<UsersIcon class="w-8 h-8 mx-auto text-muted-foreground/60" />
			<p class="font-semibold text-foreground">No friends added yet</p>
			<p class="text-xs max-w-sm mx-auto">
				Add peers by their 42 intranet login above, or import a JSON file containing a list of user IDs (e.g. <code class="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">[123, 456]</code>).
			</p>
		</div>
	{:else if isLoading && friendUsers.length === 0}
		<div class="border rounded-md p-8 text-center text-muted-foreground text-sm space-y-2">
			<RefreshCwIcon class="w-5 h-5 animate-spin mx-auto text-primary" />
			<p>Loading {friendsStore.ids.length} friend profiles...</p>
		</div>
	{:else if filteredFriends.length === 0}
		<div class="border rounded-md p-8 text-center text-muted-foreground text-sm space-y-1">
			<p class="font-semibold text-foreground">No matching friends</p>
			<p class="text-xs">No saved friend matched "{searchQuery}".</p>
		</div>
	{:else}
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<span>{filteredFriends.length} friend{filteredFriends.length === 1 ? '' : 's'}</span>
			</div>

			<div class="border rounded-md divide-y text-sm">
				{#each filteredFriends as friend}
					{@const avatar = friend.image?.link ?? friend.image?.versions?.small}
					{@const avatarUrl = avatar ? getCdnProxyUrl(avatar) : null}
					<div class="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3">
						<div class="flex items-center gap-3 min-w-0">
							<div class="relative shrink-0">
								{#if avatarUrl}
									<img
										src={avatarUrl}
										alt={friend.login}
										class="w-9 h-9 rounded-full object-cover border bg-muted"
									/>
								{:else}
									<div class="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold uppercase">
										{friend.login.slice(0, 2)}
									</div>
								{/if}

								{#if friend.location}
									<span
										class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background"
										title={`Online at ${friend.location}`}
									></span>
								{/if}
							</div>

							<div class="min-w-0">
								<div class="flex items-center gap-2">
									<a
										href={`/users/${friend.login}`}
										class="font-semibold text-foreground hover:underline truncate"
									>
										{friend.login}
									</a>
									{#if friend['staff?']}
										<Badge variant="secondary" class="text-[10px] uppercase px-1 py-0 font-mono">
											Staff
										</Badge>
									{/if}
								</div>
								<div class="flex items-center gap-2 text-xs text-muted-foreground truncate">
									<span>{friend.usual_full_name || friend.displayname || friend.login}</span>
									{#if friend.location}
										<span>&bull;</span>
										<span class="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-medium">
											<MapPinIcon class="w-3 h-3" />
											{friend.location}
										</span>
									{:else}
										<span>&bull;</span>
										<span class="text-muted-foreground/70">Unavailable</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="flex items-center gap-1.5 shrink-0">
							<a
								href={`/users/${friend.login}`}
								class="inline-flex items-center justify-center h-8 px-2.5 rounded-md border text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors gap-1"
							>
								<span>Profile</span>
								<ArrowRightIcon class="w-3 h-3" />
							</a>

							<Button
								variant="ghost"
								size="sm"
								class="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
								title="Remove friend"
								onclick={() => handleRemoveFriend(friend.id)}
							>
								<Trash2Icon class="w-3.5 h-3.5" />
								<span class="sr-only">Remove friend</span>
							</Button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
