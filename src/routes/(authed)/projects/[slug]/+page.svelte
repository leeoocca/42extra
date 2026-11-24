<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import XCircleIcon from '@lucide/svelte/icons/x-circle';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import UsersIcon from '@lucide/svelte/icons/users';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import type { PageData } from './$types';
	import type { FtProjectUser } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	let p = $derived(data.project);
	let activeSession = $derived(p?.project_sessions?.[0]);

	// Subscribed students state (loaded on demand)
	let scope = $state<'global' | 'campus'>('global');
	let projectUsers = $state<FtProjectUser[]>([]);
	let hasRequestedLoad = $state(false);
	let currentPage = $state(1);
	let isLoadingUsers = $state(false);
	let isLoadingMore = $state(false);
	let hasMore = $state(false);
	let errorUsers = $state<string | null>(null);

	async function loadUsersForScope(targetScope: 'global' | 'campus') {
		if (!p?.id || isLoadingUsers) return;
		scope = targetScope;
		hasRequestedLoad = true;
		currentPage = 1;
		isLoadingUsers = true;
		errorUsers = null;

		try {
			const campusQuery = targetScope === 'campus' ? `&filter[campus]=${data.primaryCampusId}` : '';
			const res = await fetch(
				`/api/v2/projects/${p.id}/projects_users?page[number]=1&page[size]=100&sort=-updated_at${campusQuery}`
			);
			if (!res.ok) {
				const err = await res.json().catch(() => null);
				throw new Error(err?.message || `Failed to fetch students (${res.status})`);
			}
			const json = await res.json();
			projectUsers = Array.isArray(json) ? (json as FtProjectUser[]) : [];
			hasMore = projectUsers.length >= 100;
		} catch (err: any) {
			errorUsers = err?.message || 'Error loading students';
		} finally {
			isLoadingUsers = false;
		}
	}

	async function loadMoreProjectUsers() {
		if (!p?.id || isLoadingMore || !hasMore) return;
		isLoadingMore = true;
		errorUsers = null;

		try {
			const nextPage = currentPage + 1;
			const campusQuery = scope === 'campus' ? `&filter[campus]=${data.primaryCampusId}` : '';
			const res = await fetch(
				`/api/v2/projects/${p.id}/projects_users?page[number]=${nextPage}&page[size]=100&sort=-updated_at${campusQuery}`
			);
			if (!res.ok) {
				const err = await res.json().catch(() => null);
				throw new Error(err?.message || `Failed to load more users (${res.status})`);
			}
			const json = await res.json();
			const newItems = Array.isArray(json) ? (json as FtProjectUser[]) : [];

			if (newItems.length === 0) {
				hasMore = false;
			} else {
				projectUsers = [...projectUsers, ...newItems];
				currentPage = nextPage;
				if (newItems.length < 100) {
					hasMore = false;
				}
			}
		} catch (err: any) {
			errorUsers = err?.message || 'Error loading more students';
		} finally {
			isLoadingMore = false;
		}
	}

	function formatDate(isoDate?: string | null) {
		if (!isoDate) return 'N/A';
		const d = new Date(isoDate);
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function formatStatus(status: string) {
		return status.replace(/_/g, ' ');
	}

	function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
		switch (status) {
			case 'finished':
				return 'default';
			case 'in_progress':
			case 'searching_a_group':
				return 'secondary';
			case 'parent':
				return 'outline';
			default:
				return 'outline';
		}
	}
</script>

<div class="space-y-6">
	<!-- Back link above title -->
	<div>
		<Button
			variant="ghost"
			size="sm"
			href="/projects"
			class="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
		>
			<ArrowLeftIcon class="w-3.5 h-3.5" />
			<span>Back to Projects</span>
		</Button>
	</div>

	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{p?.name || data.slug}
				</h1>
				{#if p?.exam}
					<Badge variant="destructive" class="text-[10px] uppercase px-1.5 py-0">
						Exam
					</Badge>
				{/if}
			</div>
			<p class="text-xs text-muted-foreground font-mono mt-0.5">
				{data.slug}
			</p>
		</div>
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{data.error}
		</div>
	{:else if p}
		<!-- Description List: Project Metadata -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Project Specification</h2>
			<dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3.5 border rounded-md p-4 text-sm">
				<div>
					<dt class="text-xs text-muted-foreground font-medium">Project ID</dt>
					<dd class="font-semibold text-foreground mt-0.5">#{p.id}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Slug</dt>
					<dd class="font-mono text-foreground mt-0.5 truncate">{p.slug}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Difficulty (XP Weight)</dt>
					<dd class="font-semibold text-foreground mt-0.5">
						{p.difficulty ?? 0} pts
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Team Mode</dt>
					<dd class="text-foreground mt-0.5 capitalize">
						{#if activeSession?.solo === true}
							Solo project
						{:else if activeSession?.solo === false}
							Group project (max {activeSession.max_people ?? 'multiple'})
						{:else}
							Standard
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Estimate Duration</dt>
					<dd class="text-foreground mt-0.5">
						{activeSession?.estimate_time || (activeSession?.duration_days ? `${activeSession.duration_days} days` : 'Flexible')}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Subscriptable</dt>
					<dd class="text-foreground mt-0.5">
						{activeSession?.is_subscriptable ? 'Open for registration' : 'Rule-based / Prerequisites'}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Associated Cursus</dt>
					<dd class="text-foreground mt-0.5 flex flex-wrap gap-1">
						{#if p.cursus && p.cursus.length > 0}
							{#each p.cursus as c}
								<a
									href={`/cursus/${c.slug}`}
									class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
								>
									<BookOpenIcon class="w-3.5 h-3.5 text-muted-foreground" />
									{c.name}
								</a>
							{/each}
						{:else}
							<span class="text-muted-foreground">Universal / Any</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Parent Project</dt>
					<dd class="text-foreground mt-0.5">
						{#if p.parent}
							<a href={`/projects/${p.parent.slug}`} class="text-primary hover:underline font-medium">
								{p.parent.name}
							</a>
						{:else}
							<span class="text-muted-foreground">None (Root project)</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Last Updated</dt>
					<dd class="text-muted-foreground mt-0.5">
						{formatDate(p.updated_at)}
					</dd>
				</div>
			</dl>
		</div>

		<!-- Session Description -->
		{#if activeSession?.description}
			<div class="space-y-2">
				<h2 class="text-base font-semibold tracking-tight text-foreground">Overview & Objectives</h2>
				<div class="border rounded-md p-4 text-sm space-y-3">
					<p class="text-foreground leading-relaxed">
						{activeSession.description}
					</p>

					{#if activeSession.objectives && activeSession.objectives.length > 0}
						<div class="space-y-1.5 pt-2 border-t">
							<span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Objectives:</span>
							<div class="flex flex-wrap gap-1.5 pt-0.5">
								{#each activeSession.objectives as obj}
									<Badge variant="secondary" class="text-xs px-2 py-0.5">
										{obj}
									</Badge>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Sub-projects / Children -->
		{#if p.children && p.children.length > 0}
			<div class="space-y-2">
				<h2 class="text-base font-semibold tracking-tight text-foreground">Sub-projects ({p.children.length})</h2>
				<div class="border rounded-md divide-y text-sm">
					{#each p.children as child}
						<a
							href={`/projects/${child.slug}`}
							class="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors group block text-inherit"
						>
							<span class="font-medium text-foreground group-hover:underline">
								{child.name}
							</span>
							<span class="text-muted-foreground text-xs">#{child.id}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Students Subscribed & Validated Section -->
		<div class="space-y-3 pt-2">
			<!-- Header with Global first, then Local Campus, with badges inside filter buttons -->
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t pt-4">
				<div class="flex items-center gap-2">
					<UsersIcon class="w-4 h-4 text-muted-foreground" />
					<h2 class="text-base font-semibold tracking-tight text-foreground">
						Subscribed Students
					</h2>
				</div>

				<!-- Scope Toggle: Global first, then Campus. Numbers in badges inside buttons -->
				<div class="inline-flex rounded-lg border p-0.5 bg-muted/40 gap-0.5">
					<Button
						variant={scope === 'global' ? 'secondary' : 'ghost'}
						size="xs"
						disabled={isLoadingUsers}
						onclick={() => loadUsersForScope('global')}
						class="gap-1.5"
					>
						<span>Global</span>
						<Badge variant="outline" class="font-mono text-[10px] px-1 py-0 h-4 tabular-nums">
							{data.globalTotal}
						</Badge>
					</Button>
					<Button
						variant={scope === 'campus' ? 'secondary' : 'ghost'}
						size="xs"
						disabled={isLoadingUsers}
						onclick={() => loadUsersForScope('campus')}
						class="gap-1.5"
					>
						<span>{data.primaryCampusName}</span>
						<Badge variant="outline" class="font-mono text-[10px] px-1 py-0 h-4 tabular-nums">
							{data.campusTotal}
						</Badge>
					</Button>
				</div>
			</div>

			<!-- Users List Area (loaded only on request) -->
			{#if !hasRequestedLoad}
				<div class="border border-dashed rounded-md p-8 text-center text-muted-foreground text-xs space-y-3 bg-muted/10">
					<p class="font-medium text-foreground text-sm">
						Explore Students on this Project
					</p>
					<p class="max-w-md mx-auto text-muted-foreground">
						View students currently subscribed or validated. Click below to load activity.
					</p>
					<div class="flex items-center justify-center gap-2 pt-1">
						<Button
							variant="outline"
							size="sm"
							onclick={() => loadUsersForScope('global')}
							class="gap-1.5"
						>
							<UsersIcon class="w-3.5 h-3.5 text-muted-foreground" />
							<span>Load Global Students</span>
							<Badge variant="secondary" class="font-mono text-[10px] px-1.5 py-0 tabular-nums">
								{data.globalTotal}
							</Badge>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onclick={() => loadUsersForScope('campus')}
							class="gap-1.5"
						>
							<span>Load {data.primaryCampusName} Students</span>
							<Badge variant="secondary" class="font-mono text-[10px] px-1.5 py-0 tabular-nums">
								{data.campusTotal}
							</Badge>
						</Button>
					</div>
				</div>
			{:else if isLoadingUsers && projectUsers.length === 0}
				<div class="border rounded-md p-8 text-center text-muted-foreground text-xs space-y-2">
					<RefreshCwIcon class="w-4 h-4 animate-spin mx-auto text-primary" />
					<p>Loading {scope === 'global' ? 'global' : data.primaryCampusName} students...</p>
				</div>
			{:else if projectUsers.length === 0}
				<div class="border rounded-md p-6 text-center text-muted-foreground text-xs">
					No student subscriptions recorded for {scope === 'global' ? 'any campus' : data.primaryCampusName}.
				</div>
			{:else}
				<div class="border rounded-md divide-y text-sm">
					{#each projectUsers as pu}
						{@const userObj = pu.user}
						{@const isValidated = Boolean(pu['validated?'] ?? pu.validated)}
						{@const rawImg = userObj?.image?.link ?? userObj?.image?.versions?.small}
						{@const avatarUrl = rawImg ? getCdnProxyUrl(rawImg) : null}
						<div class="flex items-center justify-between p-3.5 gap-3 hover:bg-muted/30 transition-colors">
							<div class="flex items-center gap-3 min-w-0">
								{#if userObj?.login}
									<a href={`/users/${userObj.login}/projects/${data.slug}`} class="shrink-0">
										<Avatar.Root class="size-8">
											{#if avatarUrl}
												<Avatar.Image src={avatarUrl} alt={userObj.login} />
											{/if}
											<Avatar.Fallback class="text-xs font-semibold bg-muted uppercase">
												{userObj.login.slice(0, 2)}
											</Avatar.Fallback>
										</Avatar.Root>
									</a>
								{:else}
									<div class="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
										42
									</div>
								{/if}

								<div class="min-w-0 space-y-0.5">
									<div class="flex items-center gap-2">
										{#if userObj?.login}
											<a
												href={`/users/${userObj.login}/projects/${data.slug}`}
												class="font-semibold text-foreground hover:underline truncate text-sm"
											>
												{userObj.login}
											</a>
											{#if userObj.displayname}
												<span class="hidden sm:inline text-muted-foreground text-xs truncate">
													({userObj.displayname})
												</span>
											{/if}
											<a
												href={`/users/${userObj.login}`}
												class="text-[11px] text-muted-foreground hover:text-foreground hover:underline shrink-0"
												title="View user profile"
											>
												profile &rarr;
											</a>
										{:else}
											<span class="font-semibold text-foreground text-sm">Student #{pu.id}</span>
										{/if}

										{#if pu.occurrence > 0}
											<span class="text-xs text-muted-foreground">
												retry #{pu.occurrence}
											</span>
										{/if}
									</div>

									<div class="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
										<Badge variant={getStatusVariant(pu.status)} class="text-[10px] capitalize px-1.5 py-0">
											{formatStatus(pu.status)}
										</Badge>
										{#if pu.updated_at}
											<span class="flex items-center gap-1">
												<ClockIcon class="w-3 h-3" />
												updated {formatDate(pu.updated_at)}
											</span>
										{/if}
									</div>
								</div>
							</div>

							<!-- Right: Mark & Status Icon (always on the right) -->
							<div class="flex items-center gap-2 shrink-0">
								{#if pu.final_mark !== null && pu.final_mark !== undefined}
									<a
										href={userObj?.login ? `/users/${userObj.login}/projects/${data.slug}` : undefined}
										class="font-bold text-sm tabular-nums flex items-center gap-1.5 hover:underline {isValidated ? 'text-emerald-600' : 'text-destructive'}"
									>
										<span>{pu.final_mark}</span>
										{#if isValidated}
											<CheckCircle2Icon class="w-4 h-4 text-emerald-600" />
										{:else}
											<XCircleIcon class="w-4 h-4 text-destructive" />
										{/if}
									</a>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				{#if errorUsers}
					<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-2.5 text-xs">
						{errorUsers}
					</div>
				{/if}

				{#if hasMore}
					<div class="flex justify-center pt-2">
						<Button
							variant="outline"
							size="sm"
							onclick={loadMoreProjectUsers}
							disabled={isLoadingMore}
							class="gap-1.5"
						>
							{#if isLoadingMore}
								<RefreshCwIcon class="w-3.5 h-3.5 animate-spin" />
								<span>Loading more students...</span>
							{:else}
								<span>Load more students</span>
							{/if}
						</Button>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
