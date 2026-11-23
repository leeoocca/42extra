<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import {
		Building2,
		MapPin,
		Users,
		Globe,
		Clock,
		Search,
		RefreshCw,
		AlertCircle,
		ExternalLink
	} from '@lucide/svelte';
	import type { PageData } from './$types';
	import type { FtCampus } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let filterStatus = $state<'all' | 'active' | 'public'>('all');
	let isRefreshing = $state(false);
	let refreshError = $state<string | null>(null);
	let customCampuses = $state<FtCampus[] | null>(null);

	let activeCampuses = $derived(customCampuses ?? data.campuses ?? []);

	async function handleRefresh() {
		isRefreshing = true;
		refreshError = null;
		try {
			const res = await fetch('/api/42/campuses');
			if (!res.ok) {
				const err = await res.json().catch(() => null);
				throw new Error(err?.message || `Refresh failed (${res.status})`);
			}
			const json = await res.json();
			customCampuses = json.campuses ?? [];
		} catch (err: any) {
			refreshError = err?.message || 'Failed to refresh campus list from 42 API';
		} finally {
			isRefreshing = false;
		}
	}

	let filteredCampuses = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		return activeCampuses.filter((c) => {
			if (filterStatus === 'active' && !c.active) return false;
			if (filterStatus === 'public' && !c.public) return false;

			if (!q) return true;

			const nameMatch = c.name?.toLowerCase().includes(q);
			const cityMatch = c.city?.toLowerCase().includes(q);
			const countryMatch = c.country?.toLowerCase().includes(q);
			const tzMatch = c.time_zone?.toLowerCase().includes(q);

			return nameMatch || cityMatch || countryMatch || tzMatch;
		});
	});

	let totalStudents = $derived(
		activeCampuses.reduce((acc, c) => acc + (c.users_count || 0), 0)
	);

	let activeCount = $derived(
		activeCampuses.filter((c) => c.active).length
	);
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight md:text-3xl">Campuses</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Global network directory of all 42 campuses, student populations, and locations.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				class="gap-1.5"
				disabled={isRefreshing}
				onclick={handleRefresh}
			>
				<RefreshCw class="size-4 {isRefreshing ? 'animate-spin' : ''}" />
				<span>{isRefreshing ? 'Syncing...' : 'Sync Campuses'}</span>
			</Button>
		</div>
	</div>

	<!-- Error Alert if any -->
	{#if data.error || refreshError}
		<div
			class="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
		>
			<AlertCircle class="size-5 shrink-0" />
			<div class="flex-1">
				<p class="font-medium">Failed to fetch campus directory</p>
				<p class="text-xs text-destructive/80 mt-0.5">{refreshError || data.error}</p>
			</div>
		</div>
	{/if}

	<!-- Overview Metrics -->
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
		<div class="rounded-xl border border-border bg-card p-4 shadow-xs">
			<div class="flex items-center justify-between text-muted-foreground">
				<span class="text-xs font-medium">Total Campuses</span>
				<Building2 class="size-4 text-primary" />
			</div>
			<div class="mt-2 text-2xl font-bold tracking-tight text-foreground">
				{activeCampuses.length}
			</div>
			<p class="mt-1 text-xs text-muted-foreground">{activeCount} active worldwide</p>
		</div>

		<div class="rounded-xl border border-border bg-card p-4 shadow-xs">
			<div class="flex items-center justify-between text-muted-foreground">
				<span class="text-xs font-medium">Global Students</span>
				<Users class="size-4 text-sky-500" />
			</div>
			<div class="mt-2 text-2xl font-bold tracking-tight text-foreground">
				{totalStudents.toLocaleString()}
			</div>
			<p class="mt-1 text-xs text-muted-foreground">Registered users across all campuses</p>
		</div>

		<div class="col-span-2 sm:col-span-1 rounded-xl border border-border bg-card p-4 shadow-xs">
			<div class="flex items-center justify-between text-muted-foreground">
				<span class="text-xs font-medium">Network Scope</span>
				<Globe class="size-4 text-emerald-500" />
			</div>
			<div class="mt-2 text-2xl font-bold tracking-tight text-foreground">
				42 Network
			</div>
			<p class="mt-1 text-xs text-muted-foreground">Free tuition, peer-to-peer learning</p>
		</div>
	</div>

	<!-- Controls & Filters Bar -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<!-- Search Input -->
		<div class="relative flex-1 max-w-md">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
			<Input
				type="search"
				placeholder="Search campus, city, country, or timezone..."
				bind:value={searchQuery}
				class="pl-9 h-9 text-sm"
			/>
		</div>

		<!-- Status Filter Pills -->
		<div class="flex items-center gap-1.5 self-start sm:self-auto">
			<Button
				variant={filterStatus === 'all' ? 'secondary' : 'ghost'}
				size="sm"
				class="h-8 text-xs font-medium"
				onclick={() => (filterStatus = 'all')}
			>
				All ({activeCampuses.length})
			</Button>
			<Button
				variant={filterStatus === 'active' ? 'secondary' : 'ghost'}
				size="sm"
				class="h-8 text-xs font-medium"
				onclick={() => (filterStatus = 'active')}
			>
				Active ({activeCount})
			</Button>
			<Button
				variant={filterStatus === 'public' ? 'secondary' : 'ghost'}
				size="sm"
				class="h-8 text-xs font-medium"
				onclick={() => (filterStatus = 'public')}
			>
				Public
			</Button>
		</div>
	</div>

	<!-- Campuses Grid -->
	{#if filteredCampuses.length > 0}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredCampuses as campus (campus.id)}
				<div class="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-border/80 hover:shadow-sm transition-all">
					<div class="space-y-3">
						<!-- Card Top: Name & Badges -->
						<div class="flex items-start justify-between gap-2">
							<div class="min-w-0">
								<h3 class="font-bold text-base text-foreground tracking-tight truncate">
									{campus.name}
								</h3>
								<div class="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
									<MapPin class="size-3.5 shrink-0 text-muted-foreground/80" />
									<span class="truncate">
										{[campus.city, campus.country].filter(Boolean).join(', ') || 'Global'}
									</span>
								</div>
							</div>
							<div class="shrink-0 flex items-center gap-1">
								{#if campus.active}
									<Badge variant="default" class="bg-emerald-600 hover:bg-emerald-600/90 text-[10px] text-white">
										Active
									</Badge>
								{:else}
									<Badge variant="outline" class="text-[10px] text-muted-foreground">
										Inactive
									</Badge>
								{/if}
							</div>
						</div>

						<!-- Details List -->
						<div class="space-y-1.5 pt-2 border-t border-border/60 text-xs text-muted-foreground">
							{#if campus.users_count !== undefined}
								<div class="flex items-center justify-between">
									<span class="flex items-center gap-1.5">
										<Users class="size-3.5 text-muted-foreground/70" />
										Students
									</span>
									<span class="font-semibold text-foreground font-mono">
										{campus.users_count.toLocaleString()}
									</span>
								</div>
							{/if}

							{#if campus.time_zone}
								<div class="flex items-center justify-between">
									<span class="flex items-center gap-1.5">
										<Clock class="size-3.5 text-muted-foreground/70" />
										Timezone
									</span>
									<span class="font-mono text-[11px] truncate max-w-[150px]">
										{campus.time_zone}
									</span>
								</div>
							{/if}

							{#if campus.email_extension}
								<div class="flex items-center justify-between">
									<span class="text-muted-foreground/80">Email</span>
									<span class="font-mono text-[11px] text-muted-foreground">
										@{campus.email_extension}
									</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Card Footer: Website link if available -->
					{#if campus.website}
						<div class="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
							<a
								href={campus.website.startsWith('http') ? campus.website : `https://${campus.website}`}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
							>
								<span>Website</span>
								<ExternalLink class="size-3" />
							</a>
							<span class="text-[10px] text-muted-foreground font-mono">ID #{campus.id}</span>
						</div>
					{:else}
						<div class="mt-4 pt-3 border-t border-border/50 flex items-center justify-end">
							<span class="text-[10px] text-muted-foreground font-mono">ID #{campus.id}</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty Search State -->
		<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
			<Building2 class="size-10 text-muted-foreground/50 mb-3" />
			<h3 class="text-base font-semibold text-foreground">No campuses found</h3>
			<p class="mt-1 text-sm text-muted-foreground max-w-sm">
				No 42 campus matches your search filter "{searchQuery}". Try searching for another city, country, or name.
			</p>
			<Button
				variant="outline"
				size="sm"
				class="mt-4 text-xs"
				onclick={() => {
					searchQuery = '';
					filterStatus = 'all';
				}}
			>
				Reset filters
			</Button>
		</div>
	{/if}
</div>
