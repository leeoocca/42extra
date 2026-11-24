<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import UserIcon from '@lucide/svelte/icons/user';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	let query = $state('');
	let isSearching = $state(false);
	let errorMsg = $state<string | null>(null);
	let results = $state<any[]>([]);
	let hasSearched = $state(false);

	async function handleSearch(e?: Event) {
		if (e) e.preventDefault();
		const q = query.trim().toLowerCase();
		if (!q) return;

		isSearching = true;
		errorMsg = null;
		hasSearched = true;

		try {
			// First try single user lookup, otherwise range search
			const res = await fetch(`/api/v2/users/${q}`);
			if (res.ok) {
				const user = await res.json();
				results = [user];
			} else {
				// Search by range query
				const rangeRes = await fetch(`/api/v2/users?range[login]=${q},${q}z&page[size]=20`);
				if (rangeRes.ok) {
					const list = await rangeRes.json();
					results = Array.isArray(list) ? list : [];
				} else {
					results = [];
				}
			}
		} catch (err: any) {
			errorMsg = err?.message || 'Search failed';
			results = [];
		} finally {
			isSearching = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="border-b pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Peer Search</h1>
	</div>

	<!-- Search bar -->
	<form onsubmit={handleSearch} class="flex max-w-md gap-2">
		<div class="relative flex-1">
			<SearchIcon class="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search by student login (e.g. raveriss)..."
				bind:value={query}
				class="h-8 pl-8 text-xs"
			/>
		</div>
		<Button
			type="submit"
			size="sm"
			class="h-8 px-3 text-xs"
			disabled={isSearching || !query.trim()}
		>
			{isSearching ? 'Searching...' : 'Search'}
		</Button>
	</form>

	{#if errorMsg}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{errorMsg}
		</div>
	{/if}

	{#if hasSearched}
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold tracking-tight text-foreground">Results</h2>
				<span class="text-xs text-muted-foreground">
					{results.length} found
				</span>
			</div>

			{#if results.length === 0}
				<div class="rounded-md border p-6 text-center text-xs text-muted-foreground">
					No peer found matching "{query}".
				</div>
			{:else}
				<div class="divide-y rounded-md border text-base">
					{#each results as user}
						{@const avatar = user.image?.link ?? user.image?.versions?.small}
						{@const avatarUrl = avatar ? getCdnProxyUrl(avatar) : null}
						<div
							class="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-muted/30"
						>
							<div class="flex min-w-0 items-center gap-3">
								{#if avatarUrl}
									<img
										src={avatarUrl}
										alt={user.login}
										class="h-9 w-9 shrink-0 rounded-full border object-cover"
										loading="lazy"
									/>
								{:else}
									<div
										class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-bold"
									>
										{user.login?.slice(0, 2).toUpperCase()}
									</div>
								{/if}

								<div class="min-w-0">
									<div class="flex items-center gap-2">
										<a
											href={`/users/${user.login}`}
											class="font-mono text-base font-semibold text-foreground hover:underline"
										>
											@{user.login}
										</a>
										{#if user.displayname}
											<span class="truncate text-xs text-muted-foreground">
												({user.displayname})
											</span>
										{/if}
										{#if user['staff?']}
											<Badge variant="default" class="px-1.5 py-0 text-xs">Staff</Badge>
										{/if}
									</div>

									{#if user.location}
										<div class="mt-0.5 flex items-center gap-1 font-mono text-xs text-emerald-600">
											<MapPinIcon class="h-3.5 w-3.5" />
											{user.location}
										</div>
									{/if}
								</div>
							</div>

							<a
								href={`/users/${user.login}`}
								class="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
							>
								profile <ArrowRightIcon class="h-3.5 w-3.5" />
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
