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
		<p class="text-xs text-muted-foreground mt-0.5">
			Find students, staff, and alumni across the 42 network.
		</p>
	</div>

	<!-- Search bar -->
	<form onsubmit={handleSearch} class="flex gap-2 max-w-md">
		<div class="relative flex-1">
			<SearchIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search by student login (e.g. raveriss)..."
				bind:value={query}
				class="pl-8 h-8 text-xs"
			/>
		</div>
		<Button type="submit" size="sm" class="h-8 text-xs px-3" disabled={isSearching || !query.trim()}>
			{isSearching ? 'Searching...' : 'Search'}
		</Button>
	</form>

	{#if errorMsg}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
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
				<div class="border rounded-md p-6 text-center text-muted-foreground text-xs">
					No peer found matching "{query}".
				</div>
			{:else}
				<div class="border rounded-md divide-y text-sm">
					{#each results as user}
						{@const avatar = user.image?.link ?? user.image?.versions?.small}
						{@const avatarUrl = avatar ? getCdnProxyUrl(avatar) : null}
						<div class="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3">
							<div class="flex items-center gap-3 min-w-0">
								{#if avatarUrl}
									<img
										src={avatarUrl}
										alt={user.login}
										class="w-9 h-9 rounded-full border object-cover shrink-0"
										loading="lazy"
									/>
								{:else}
									<div class="w-9 h-9 rounded-full border bg-muted flex items-center justify-center font-bold text-xs shrink-0">
										{user.login?.slice(0, 2).toUpperCase()}
									</div>
								{/if}

								<div class="min-w-0">
									<div class="flex items-center gap-2">
										<a
											href={`/users/${user.login}`}
											class="font-semibold text-sm text-foreground hover:underline font-mono"
										>
											@{user.login}
										</a>
										{#if user.displayname}
											<span class="text-muted-foreground text-xs truncate">
												({user.displayname})
											</span>
										{/if}
										{#if user['staff?']}
											<Badge variant="default" class="text-xs px-1.5 py-0">Staff</Badge>
										{/if}
									</div>

									{#if user.location}
										<div class="flex items-center gap-1 text-xs text-emerald-600 font-mono mt-0.5">
											<MapPinIcon class="w-3.5 h-3.5" />
											{user.location}
										</div>
									{/if}
								</div>
							</div>

							<a
								href={`/users/${user.login}`}
								class="text-xs text-primary hover:underline inline-flex items-center gap-1 shrink-0 font-medium"
							>
								profile <ArrowRightIcon class="w-3.5 h-3.5" />
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
