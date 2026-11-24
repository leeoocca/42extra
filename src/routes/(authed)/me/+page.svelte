<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import XCircleIcon from '@lucide/svelte/icons/x-circle';
	import type { PageData } from './$types';
	import type { FtUserMe } from '#lib/schemas/42.js';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import { onMount, onDestroy } from 'svelte';

	let { data }: { data: PageData } = $props();

	let isRefreshing = $state(false);
	let refreshError = $state<string | null>(null);
	let customProfile = $state<FtUserMe | null>(null);
	let activeProfile = $derived(customProfile ?? data.profile);
	let copiedJson = $state(false);
	let isAvatarModalOpen = $state(false);

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

	let primaryCampus = $derived.by(() => {
		const pc = activeProfile?.campus_users?.find((cu) => cu.is_primary);
		return (
			activeProfile?.campus?.find((c) => c.id === pc?.campus_id)?.name ??
			activeProfile?.campus?.[0]?.name ??
			'N/A'
		);
	});

	let poolDisplay = $derived.by(() => {
		if (!activeProfile?.pool_month || !activeProfile?.pool_year) return 'N/A';
		return `${activeProfile.pool_month.charAt(0).toUpperCase() + activeProfile.pool_month.slice(1)} ${activeProfile.pool_year}`;
	});

	let activeProjects = $derived.by(() => {
		return activeProfile?.projects_users?.filter((p) => p.status !== 'finished') ?? [];
	});

	let finishedProjects = $derived.by(() => {
		return (activeProfile?.projects_users?.filter((p) => p.status === 'finished') ?? []).slice(
			0,
			10
		);
	});

	let avatarUrl = $derived.by(() => {
		const raw =
			activeProfile?.image?.link ??
			activeProfile?.image?.versions?.medium ??
			activeProfile?.image?.versions?.small;
		return raw ? (getCdnProxyUrl(raw) ?? null) : null;
	});

	let largeAvatarUrl = $derived.by(() => {
		const raw =
			activeProfile?.image?.versions?.large ??
			activeProfile?.image?.link ??
			activeProfile?.image?.versions?.medium;
		return raw ? (getCdnProxyUrl(raw) ?? null) : null;
	});

	function formatDate(isoDate?: string | null) {
		if (!isoDate) return 'N/A';
		const d = new Date(isoDate);
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div class="flex items-center gap-3">
			{#if avatarUrl}
				<button
					type="button"
					onclick={() => (isAvatarModalOpen = true)}
					class="relative rounded-full border p-0 transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					title="View larger profile image"
				>
					<img
						src={avatarUrl}
						alt={activeProfile?.login ?? 'User'}
						class="h-10 w-10 rounded-full object-cover"
					/>
				</button>
			{:else}
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-bold"
				>
					{activeProfile?.login?.slice(0, 2).toUpperCase() ?? '42'}
				</div>
			{/if}

			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
						{activeProfile?.usual_full_name ||
							activeProfile?.displayname ||
							activeProfile?.login ||
							'My Profile'}
					</h1>
					{#if activeProfile?.login}
						<Badge variant="outline" class="font-mono text-xs">
							@{activeProfile.login}
						</Badge>
					{/if}
				</div>
				<p class="mt-0.5 text-xs text-muted-foreground">
					Student record, cursus progression, and evaluation points.
				</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" class="h-8 text-xs" onclick={handleCopyJson}>
				{#if copiedJson}
					<CheckIcon class="mr-1 h-3.5 w-3.5 text-emerald-600" />
					Copied
				{:else}
					<CopyIcon class="mr-1 h-3.5 w-3.5" />
					JSON
				{/if}
			</Button>
		</div>
	</div>

	{#if data.error || refreshError}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{refreshError || data.error}
		</div>
	{/if}

	<!-- Description List: Profile Details -->
	<div class="space-y-2">
		<h2 class="text-base font-semibold tracking-tight text-foreground">Record Details</h2>
		<dl
			class="grid grid-cols-1 gap-x-6 gap-y-3.5 rounded-md border p-4 text-sm sm:grid-cols-2 lg:grid-cols-3"
		>
			<div>
				<dt class="text-xs font-medium text-muted-foreground">Login</dt>
				<dd class="mt-0.5 font-mono font-semibold text-foreground">
					{activeProfile?.login || 'N/A'}
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Email</dt>
				<dd class="mt-0.5 truncate font-medium text-foreground">
					{activeProfile?.email || 'N/A'}
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Kind</dt>
				<dd class="mt-0.5 font-medium text-foreground capitalize">
					{activeProfile?.kind || 'student'}
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Primary Campus</dt>
				<dd class="mt-0.5 font-medium text-foreground">
					{primaryCampus}
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Active Workstation</dt>
				<dd class="mt-0.5">
					{#if activeProfile?.location}
						<span class="inline-flex items-center gap-1 font-mono font-semibold text-emerald-600">
							<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
							{activeProfile.location}
						</span>
					{:else}
						<span class="text-muted-foreground">Unavailable (Off-campus)</span>
					{/if}
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Pool</dt>
				<dd class="mt-0.5 font-medium text-foreground">
					{poolDisplay}
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Wallet Balance</dt>
				<dd class="mt-0.5 font-semibold text-foreground">
					{activeProfile?.wallet ?? 0} ₳
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Evaluation Points</dt>
				<dd class="mt-0.5 font-semibold text-foreground">
					{activeProfile?.correction_point ?? 0} points
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Member Since</dt>
				<dd class="mt-0.5 text-muted-foreground">
					{formatDate(activeProfile?.created_at)}
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Status Flags</dt>
				<dd class="mt-0.5 flex flex-wrap items-center gap-2">
					{#if activeProfile?.['staff?']}
						<Badge variant="default" class="px-2 py-0.5 text-xs">Staff</Badge>
					{/if}
					{#if activeProfile?.['alumni?']}
						<Badge variant="secondary" class="px-2 py-0.5 text-xs">Alumni</Badge>
					{/if}
					{#if activeProfile?.['active?']}
						<Badge
							variant="outline"
							class="border-emerald-500/30 px-2 py-0.5 text-xs text-emerald-600"
						>
							Active Student
						</Badge>
					{/if}
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">Total Achievements</dt>
				<dd class="mt-0.5 font-medium text-foreground">
					{activeProfile?.achievements?.length ?? 0} badges unlocked
				</dd>
			</div>

			<div>
				<dt class="text-xs font-medium text-muted-foreground">42 Intranet Profile</dt>
				<dd class="mt-0.5">
					<a
						href={`https://profile.intra.42.fr/users/${activeProfile?.login}`}
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
					>
						intra profile <ExternalLinkIcon class="h-3 w-3" />
					</a>
				</dd>
			</div>
		</dl>
	</div>

	<!-- Cursus Progress -->
	<div class="space-y-2">
		<h2 class="text-base font-semibold tracking-tight text-foreground">Cursus Progress</h2>
		{#if !activeProfile?.cursus_users || activeProfile.cursus_users.length === 0}
			<p class="rounded-md border p-4 text-sm text-muted-foreground">
				No enrolled cursus recorded.
			</p>
		{:else}
			<div class="divide-y rounded-md border text-sm">
				{#each activeProfile.cursus_users as cu}
					<div
						class="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-muted/30"
					>
						<div class="min-w-0 space-y-0.5">
							<div class="flex items-center gap-2">
								<span class="font-semibold text-foreground">
									{cu.cursus?.name ?? `Cursus #${cu.cursus_id}`}
								</span>
								{#if cu.grade}
									<Badge variant="outline" class="px-2 py-0.5 text-xs capitalize">
										{cu.grade}
									</Badge>
								{/if}
							</div>
							<div class="text-xs text-muted-foreground">
								level {cu.level.toFixed(2)} &bull; {cu.skills?.length ?? 0} skills
							</div>
						</div>

						<div class="shrink-0 text-right text-xs text-muted-foreground">
							{cu.end_at ? `Ended ${formatDate(cu.end_at)}` : 'In Progress'}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Active Projects -->
	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Active Projects</h2>
			<span class="text-xs text-muted-foreground">{activeProjects.length} active</span>
		</div>

		{#if activeProjects.length === 0}
			<p class="rounded-md border p-4 text-sm text-muted-foreground">
				No projects currently in progress.
			</p>
		{:else}
			<div class="divide-y rounded-md border text-sm">
				{#each activeProjects as p}
					<div
						class="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-muted/30"
					>
						<div class="flex min-w-0 items-center gap-2.5">
							<a
								href={`/projects/${p.project.slug}`}
								class="truncate font-semibold text-foreground hover:underline"
							>
								{p.project.name}
							</a>
							<Badge variant="outline" class="px-2 py-0.5 text-xs capitalize">
								{p.status.replace(/_/g, ' ')}
							</Badge>
						</div>

						<div class="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
							{#if p.occurrence > 0}
								<span>retry #{p.occurrence}</span>
							{/if}
							{#if activeProfile?.login}
								<a
									href={`/users/${activeProfile.login}/projects/${p.project.slug}`}
									class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
								>
									evaluations &rarr;
								</a>
							{/if}
							<a
								href={`https://projects.intra.42.fr/projects/${p.project.slug}`}
								target="_blank"
								rel="noreferrer"
								class="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground"
							>
								intra <ExternalLinkIcon class="h-3 w-3" />
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Recent Validations -->
	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<h2 class="text-base font-semibold tracking-tight text-foreground">
				Recent Finished Projects
			</h2>
			<span class="text-xs text-muted-foreground">{finishedProjects.length} shown</span>
		</div>

		{#if finishedProjects.length === 0}
			<p class="rounded-md border p-4 text-sm text-muted-foreground">No finished projects yet.</p>
		{:else}
			<div class="divide-y rounded-md border text-sm">
				{#each finishedProjects as p}
					<div
						class="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-muted/30"
					>
						<div class="flex min-w-0 items-center gap-2">
							<a
								href={`/projects/${p.project.slug}`}
								class="truncate font-semibold text-foreground hover:underline"
							>
								{p.project.name}
							</a>
						</div>

						<div class="flex shrink-0 items-center gap-3 text-sm">
							{#if activeProfile?.login}
								<a
									href={`/users/${activeProfile.login}/projects/${p.project.slug}`}
									class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
								>
									evaluations
								</a>
							{/if}
							{#if p.final_mark !== null && p.final_mark !== undefined}
								<a
									href={activeProfile?.login
										? `/users/${activeProfile.login}/projects/${p.project.slug}`
										: `/projects/${p.project.slug}`}
									class="font-semibold {p['validated?'] || p.validated
										? 'text-emerald-600'
										: 'text-destructive'} flex items-center gap-1 tabular-nums hover:underline"
								>
									{p.final_mark}
									{#if p['validated?'] || p.validated}
										<CheckCircle2Icon class="h-4 w-4" />
									{:else}
										<XCircleIcon class="h-4 w-4" />
									{/if}
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Avatar Modal Dialog -->
{#if largeAvatarUrl || avatarUrl}
	<Dialog.Root bind:open={isAvatarModalOpen}>
		<Dialog.Content class="sm:max-w-md p-4 text-center">
			<Dialog.Header>
				<Dialog.Title class="text-base font-semibold">
					{activeProfile?.usual_full_name || activeProfile?.displayname || 'My Profile Picture'}
				</Dialog.Title>
				{#if activeProfile?.login}
					<Dialog.Description class="text-xs text-muted-foreground font-mono">
						@{activeProfile.login}
					</Dialog.Description>
				{/if}
			</Dialog.Header>
			<div class="mt-2 flex items-center justify-center overflow-hidden rounded-lg bg-muted/20 p-2">
				<img
					src={largeAvatarUrl ?? avatarUrl}
					alt={activeProfile?.login ?? 'User'}
					class="max-h-[75vh] w-auto rounded-md object-contain shadow-sm"
				/>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
