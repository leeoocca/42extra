<script lang="ts">
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import {
		Coins,
		Award,
		GraduationCap,
		MapPin,
		Calendar,
		CheckCircle2,
		Clock,
		RefreshCw,
		Building2,
		BookOpen,
		Sparkles,
		Copy,
		Check,
		AlertCircle
	} from '@lucide/svelte';
	import type { PageData } from './$types';
	import type { FtUserMe } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	let isRefreshing = $state(false);
	let refreshError = $state<string | null>(null);
	let customProfile = $state<FtUserMe | null>(null);
	let activeProfile = $derived(customProfile ?? data.profile);
	let copiedJson = $state(false);
	let activeTab = $state<'overview' | 'projects' | 'cursus' | 'achievements' | 'raw'>('overview');

	async function handleRefresh() {
		isRefreshing = true;
		refreshError = null;
		try {
			const res = await fetch('/api/v2/me');
			if (!res.ok) {
				const err = await res.json().catch(() => null);
				throw new Error(err?.message || `Refresh failed (${res.status})`);
			}
			const json = await res.json();
			customProfile = json as FtUserMe;
		} catch (err: any) {
			refreshError = err?.message || 'Failed to refresh profile from 42 API';
		} finally {
			isRefreshing = false;
		}
	}

	async function handleCopyJson() {
		if (!activeProfile) return;
		try {
			await navigator.clipboard.writeText(JSON.stringify(activeProfile, null, 2));
			copiedJson = true;
			setTimeout(() => {
				copiedJson = false;
			}, 2000);
		} catch (e) {
			console.error('Failed to copy JSON:', e);
		}
	}

	// Derived metrics
	let mainCursus = $derived(
		activeProfile?.cursus_users?.find((c) => c.cursus_id === 21) ??
			activeProfile?.cursus_users?.[0]
	);

	let levelProgress = $derived(
		mainCursus ? Math.round((mainCursus.level % 1) * 100) : 0
	);

	let inProgressProjects = $derived(
		activeProfile?.projects_users?.filter(
			(p) => p.status !== 'finished' && p.status !== 'parent'
		) ?? []
	);

	let finishedProjects = $derived(
		activeProfile?.projects_users?.filter((p) => p.status === 'finished') ?? []
	);

	let primaryCampus = $derived(
		activeProfile?.campus?.[0]?.name ?? '42 Network'
	);

	let poolDisplay = $derived(
		activeProfile?.pool_month && activeProfile?.pool_year
			? `${activeProfile.pool_month.charAt(0).toUpperCase() + activeProfile.pool_month.slice(1)} ${activeProfile.pool_year}`
			: 'N/A'
	);
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight md:text-3xl">My Profile</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Real-time 42 student profile, cursus progression, and projects.
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
				<span>{isRefreshing ? 'Syncing...' : 'Sync with 42'}</span>
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
				<p class="font-medium">Failed to fetch latest 42 API data</p>
				<p class="text-xs text-destructive/80 mt-0.5">{refreshError || data.error}</p>
			</div>
		</div>
	{/if}

	<!-- Profile Hero Header Card -->
	<div class="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
			<Avatar.Root class="size-20 border-2 border-border/80 shadow-xs sm:size-24">
				<Avatar.Image
					src={getCdnProxyUrl(activeProfile?.image?.link ?? activeProfile?.image?.versions?.medium ?? data.user?.image)}
					alt={activeProfile?.usual_full_name ?? data.user?.name ?? 'User'}
					class="object-cover"
				/>
				<Avatar.Fallback class="text-xl font-bold bg-primary/10 text-primary">
					{activeProfile?.login?.slice(0, 2)?.toUpperCase() ?? '42'}
				</Avatar.Fallback>
			</Avatar.Root>

			<div class="space-y-1.5">
				<div class="flex flex-wrap items-center gap-2">
					<h2 class="text-xl font-bold text-foreground sm:text-2xl">
						{activeProfile?.usual_full_name || activeProfile?.displayname || data.user?.name || 'Student'}
					</h2>
					<Badge variant="outline" class="font-mono text-xs">
						@{activeProfile?.login ?? data.user?.email?.split('@')[0]}
					</Badge>
					{#if activeProfile?.['staff?']}
						<Badge variant="default" class="text-xs">Staff</Badge>
					{/if}
				</div>

				<p class="text-sm text-muted-foreground">{activeProfile?.email ?? data.user?.email}</p>

				<div class="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
					<span class="flex items-center gap-1">
						<Building2 class="size-3.5 text-muted-foreground/80" />
						{primaryCampus}
					</span>
					<span class="flex items-center gap-1">
						<Calendar class="size-3.5 text-muted-foreground/80" />
						Piscine {poolDisplay}
					</span>
					<span class="flex items-center gap-1">
						<MapPin class="size-3.5 text-muted-foreground/80" />
						{#if activeProfile?.location}
							<span class="inline-flex items-center gap-1 text-emerald-500 font-medium">
								<span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
								{activeProfile.location}
							</span>
						{:else}
							<span>Offline</span>
						{/if}
					</span>
				</div>
			</div>
		</div>

		<!-- Quick Badges on Right -->
		<div class="flex flex-wrap items-center gap-2 border-t border-border pt-4 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end">
			{#if mainCursus?.grade}
				<Badge variant="secondary" class="text-xs font-semibold px-2.5 py-1">
					{mainCursus.grade}
				</Badge>
			{/if}
			{#if activeProfile?.alumni}
				<Badge variant="outline" class="text-xs text-muted-foreground">Alumni</Badge>
			{/if}
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
		<!-- Wallet -->
		<div class="rounded-xl border border-border bg-card p-4.5 shadow-xs">
			<div class="flex items-center justify-between text-muted-foreground">
				<span class="text-xs font-medium">Wallet</span>
				<Coins class="size-4 text-amber-500" />
			</div>
			<div class="mt-2 text-2xl font-bold tracking-tight text-foreground">
				{activeProfile?.wallet ?? 0} <span class="text-sm font-normal text-muted-foreground">₳</span>
			</div>
			<p class="mt-1 text-xs text-muted-foreground">Available balance</p>
		</div>

		<!-- Correction Points -->
		<div class="rounded-xl border border-border bg-card p-4.5 shadow-xs">
			<div class="flex items-center justify-between text-muted-foreground">
				<span class="text-xs font-medium">Eval Points</span>
				<Award class="size-4 text-sky-500" />
			</div>
			<div class="mt-2 text-2xl font-bold tracking-tight text-foreground">
				{activeProfile?.correction_point ?? 0}
			</div>
			<p class="mt-1 text-xs text-muted-foreground">Correction points</p>
		</div>

		<!-- Cursus Level -->
		<div class="rounded-xl border border-border bg-card p-4.5 shadow-xs">
			<div class="flex items-center justify-between text-muted-foreground">
				<span class="text-xs font-medium">Cursus Level</span>
				<GraduationCap class="size-4 text-indigo-500" />
			</div>
			<div class="mt-2 flex items-baseline gap-1 text-2xl font-bold tracking-tight text-foreground">
				{mainCursus ? mainCursus.level.toFixed(2) : '0.00'}
				<span class="text-xs font-medium text-muted-foreground">({levelProgress}%)</span>
			</div>
			<div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
				<div
					class="h-full bg-primary transition-all duration-300"
					style="width: {levelProgress}%"
				></div>
			</div>
		</div>

		<!-- Pool -->
		<div class="rounded-xl border border-border bg-card p-4.5 shadow-xs">
			<div class="flex items-center justify-between text-muted-foreground">
				<span class="text-xs font-medium">Piscine</span>
				<Calendar class="size-4 text-emerald-500" />
			</div>
			<div class="mt-2 text-xl font-bold tracking-tight text-foreground truncate">
				{poolDisplay}
			</div>
			<p class="mt-1 text-xs text-muted-foreground truncate">{primaryCampus}</p>
		</div>
	</div>

	<!-- Navigation Tabs -->
	<div class="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1">
		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {activeTab === 'overview' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'}"
			onclick={() => (activeTab = 'overview')}
		>
			<Sparkles class="size-3.5" />
			Overview
		</button>
		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {activeTab === 'projects' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'}"
			onclick={() => (activeTab = 'projects')}
		>
			<BookOpen class="size-3.5" />
			Projects
			<span class="ml-0.5 rounded-full bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground">
				{activeProfile?.projects_users?.length ?? 0}
			</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {activeTab === 'cursus' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'}"
			onclick={() => (activeTab = 'cursus')}
		>
			<GraduationCap class="size-3.5" />
			Cursus & Skills
		</button>
		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {activeTab === 'achievements' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'}"
			onclick={() => (activeTab = 'achievements')}
		>
			<Award class="size-3.5" />
			Achievements
			<span class="ml-0.5 rounded-full bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground">
				{activeProfile?.achievements?.length ?? 0}
			</span>
		</button>
		<button
			type="button"
			class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {activeTab === 'raw' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'}"
			onclick={() => (activeTab = 'raw')}
		>
			Raw Model
		</button>
	</div>

	<!-- Tab: Overview -->
	{#if activeTab === 'overview'}
		<div class="grid gap-6 md:grid-cols-2">
			<!-- Active Projects Preview -->
			<div class="rounded-xl border border-border bg-card p-5 shadow-xs">
				<div class="flex items-center justify-between pb-3 border-b border-border">
					<h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
						<Clock class="size-4 text-primary" />
						Current Projects ({inProgressProjects.length})
					</h3>
					<button
						type="button"
						class="text-xs text-primary hover:underline"
						onclick={() => (activeTab = 'projects')}
					>
						View all
					</button>
				</div>
				<div class="mt-3 divide-y divide-border/60">
					{#if inProgressProjects.length > 0}
						{#each inProgressProjects.slice(0, 4) as proj}
							<div class="py-2.5 flex items-center justify-between">
								<span class="text-sm font-medium text-foreground">{proj.project.name}</span>
								<Badge variant="outline" class="text-xs capitalize font-normal">
									{proj.status.replace(/_/g, ' ')}
								</Badge>
							</div>
						{/each}
					{:else}
						<p class="py-6 text-center text-xs text-muted-foreground">
							No projects currently in progress.
						</p>
					{/if}
				</div>
			</div>

			<!-- Recent Achievements Preview -->
			<div class="rounded-xl border border-border bg-card p-5 shadow-xs">
				<div class="flex items-center justify-between pb-3 border-b border-border">
					<h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
						<Award class="size-4 text-amber-500" />
						Recent Achievements ({activeProfile?.achievements?.length ?? 0})
					</h3>
					<button
						type="button"
						class="text-xs text-primary hover:underline"
						onclick={() => (activeTab = 'achievements')}
					>
						View all
					</button>
				</div>
				<div class="mt-3 divide-y divide-border/60">
					{#if (activeProfile?.achievements?.length ?? 0) > 0}
						{#each activeProfile?.achievements?.slice(0, 4) ?? [] as ach}
							<div class="py-2.5 flex items-center justify-between gap-2">
								<div class="truncate">
									<p class="text-sm font-medium text-foreground truncate">{ach.name}</p>
									<p class="text-xs text-muted-foreground truncate">{ach.description || ach.tier}</p>
								</div>
								{#if ach.tier}
									<Badge variant="secondary" class="text-[10px] shrink-0 capitalize">
										{ach.tier}
									</Badge>
								{/if}
							</div>
						{/each}
					{:else}
						<p class="py-6 text-center text-xs text-muted-foreground">
							No achievements unlocked yet.
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Tab: Projects -->
	{#if activeTab === 'projects'}
		<div class="space-y-6">
			<!-- In progress -->
			<div class="rounded-xl border border-border bg-card p-5 shadow-xs">
				<h3 class="text-sm font-semibold text-foreground flex items-center gap-2 pb-3 border-b border-border">
					<Clock class="size-4 text-amber-500" />
					In Progress ({inProgressProjects.length})
				</h3>
				<div class="mt-3 divide-y divide-border/60">
					{#if inProgressProjects.length > 0}
						{#each inProgressProjects as proj}
							<div class="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
								<div>
									<p class="text-sm font-semibold text-foreground">{proj.project.name}</p>
									<p class="text-xs text-muted-foreground">Slug: {proj.project.slug} • Retries: {proj.retries}</p>
								</div>
								<Badge variant="outline" class="text-xs capitalize font-normal w-fit">
									{proj.status.replace(/_/g, ' ')}
								</Badge>
							</div>
						{/each}
					{:else}
						<p class="py-6 text-center text-xs text-muted-foreground">
							No projects currently in progress.
						</p>
					{/if}
				</div>
			</div>

			<!-- Finished -->
			<div class="rounded-xl border border-border bg-card p-5 shadow-xs">
				<h3 class="text-sm font-semibold text-foreground flex items-center gap-2 pb-3 border-b border-border">
					<CheckCircle2 class="size-4 text-emerald-500" />
					Completed Projects ({finishedProjects.length})
				</h3>
				<div class="mt-3 divide-y divide-border/60">
					{#if finishedProjects.length > 0}
						{#each finishedProjects as proj}
							<div class="py-3 flex items-center justify-between gap-3">
								<div class="truncate">
									<p class="text-sm font-medium text-foreground truncate">{proj.project.name}</p>
									<p class="text-xs text-muted-foreground">
										{proj.marked_at ? new Date(proj.marked_at).toLocaleDateString() : 'Validated'}
									</p>
								</div>
								<div class="flex items-center gap-2">
									{#if proj.validated === true}
										<Badge variant="default" class="bg-emerald-600 hover:bg-emerald-600/90 text-white font-mono text-xs">
											{proj.final_mark ?? 100}%
										</Badge>
									{:else if proj.validated === false}
										<Badge variant="destructive" class="font-mono text-xs">
											{proj.final_mark ?? 0}%
										</Badge>
									{:else}
										<Badge variant="secondary" class="font-mono text-xs">
											{proj.final_mark ?? 0}%
										</Badge>
									{/if}
								</div>
							</div>
						{/each}
					{:else}
						<p class="py-6 text-center text-xs text-muted-foreground">
							No completed projects recorded.
						</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Tab: Cursus & Skills -->
	{#if activeTab === 'cursus'}
		<div class="space-y-6">
			<!-- Cursus List -->
			<div class="rounded-xl border border-border bg-card p-5 shadow-xs">
				<h3 class="text-sm font-semibold text-foreground flex items-center gap-2 pb-3 border-b border-border">
					<GraduationCap class="size-4 text-primary" />
					Enrolled Cursus ({activeProfile?.cursus_users?.length ?? 0})
				</h3>
				<div class="mt-4 grid gap-4 sm:grid-cols-2">
					{#each activeProfile?.cursus_users ?? [] as cu}
						<div class="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-2">
							<div class="flex items-start justify-between">
								<div>
									<h4 class="text-sm font-bold text-foreground">{cu.cursus.name}</h4>
									<p class="text-xs text-muted-foreground">Grade: {cu.grade ?? 'None'}</p>
								</div>
								<Badge variant="default" class="text-xs font-mono">
									Level {cu.level.toFixed(2)}
								</Badge>
							</div>
							<div class="text-xs text-muted-foreground space-y-0.5">
								<p>Started: {cu.begin_at ? new Date(cu.begin_at).toLocaleDateString() : 'N/A'}</p>
								{#if cu.end_at}
									<p>Ended: {new Date(cu.end_at).toLocaleDateString()}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Skills list -->
			{#if (mainCursus?.skills?.length ?? 0) > 0}
				<div class="rounded-xl border border-border bg-card p-5 shadow-xs">
					<h3 class="text-sm font-semibold text-foreground flex items-center gap-2 pb-3 border-b border-border">
						<Sparkles class="size-4 text-primary" />
						Skills ({mainCursus?.skills?.length ?? 0})
					</h3>
					<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{#each mainCursus?.skills ?? [] as skill}
							<div class="rounded-lg border border-border/60 p-3 space-y-1.5">
								<div class="flex items-center justify-between text-xs">
									<span class="font-medium text-foreground truncate">{skill.name}</span>
									<span class="font-mono text-muted-foreground">{skill.level.toFixed(2)}</span>
								</div>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
									<div
										class="h-full bg-primary"
										style="width: {Math.min(100, Math.round((skill.level / 20) * 100))}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Tab: Achievements -->
	{#if activeTab === 'achievements'}
		<div class="rounded-xl border border-border bg-card p-5 shadow-xs">
			<h3 class="text-sm font-semibold text-foreground flex items-center gap-2 pb-3 border-b border-border">
				<Award class="size-4 text-amber-500" />
				All Achievements ({activeProfile?.achievements?.length ?? 0})
			</h3>
			<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each activeProfile?.achievements ?? [] as ach}
					<div class="flex items-start gap-3 rounded-lg border border-border/70 p-3 hover:bg-muted/20 transition-colors">
						<div class="size-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
							<Award class="size-4" />
						</div>
						<div class="min-w-0 flex-1">
							<div class="flex items-center justify-between gap-1">
								<h4 class="text-xs font-bold text-foreground truncate">{ach.name}</h4>
								{#if ach.tier}
									<Badge variant="outline" class="text-[9px] px-1.5 py-0 capitalize">
										{ach.tier}
									</Badge>
								{/if}
							</div>
							<p class="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
								{ach.description || 'Achievement unlocked'}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Tab: Raw Model -->
	{#if activeTab === 'raw'}
		<div class="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
			<div class="flex items-center justify-between pb-3 border-b border-border">
				<div>
					<h3 class="text-sm font-semibold text-foreground">Validated Zod Model Output</h3>
					<p class="text-xs text-muted-foreground">Direct JSON payload received from /api/42/me</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					class="gap-1.5 text-xs"
					onclick={handleCopyJson}
				>
					{#if copiedJson}
						<Check class="size-3.5 text-emerald-500" />
						<span>Copied!</span>
					{:else}
						<Copy class="size-3.5" />
						<span>Copy JSON</span>
					{/if}
				</Button>
			</div>

			<pre class="max-h-[500px] overflow-auto rounded-lg bg-muted/60 p-4 font-mono text-xs text-foreground/90 border border-border/80">{JSON.stringify(activeProfile, null, 2)}</pre>
		</div>
	{/if}
</div>
