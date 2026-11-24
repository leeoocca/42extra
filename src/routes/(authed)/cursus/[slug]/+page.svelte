<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import type { PageData } from './$types';
	import type { CursusProjectItem } from './+page.js';

	let { data }: { data: PageData } = $props();

	let c = $derived(data.cursus);
	let extraProjects = $state<CursusProjectItem[]>([]);
	let currentPage = $state(data.pagination.page);
	let isLoadingMore = $state(false);
	let loadMoreError = $state<string | null>(null);

	let allProjects = $derived([...(data.projects ?? []), ...extraProjects]);
	let totalLoaded = $derived(allProjects.length);
	let hasMore = $derived(totalLoaded < data.pagination.total);

	async function handleLoadMore() {
		if (isLoadingMore || !hasMore) return;
		isLoadingMore = true;
		loadMoreError = null;

		const nextPage = currentPage + 1;
		try {
			const res = await fetch(
				`/api/v2/cursus/${data.slug}/projects?page[number]=${nextPage}&page[size]=${data.pagination.pageSize}&sort=name`
			);
			if (res.ok) {
				const newProjects = await res.json();
				if (Array.isArray(newProjects)) {
					// Deduplicate by ID
					const existingIds = new Set(allProjects.map((p) => p.id));
					const uniqueIncoming = newProjects.filter(
						(p: CursusProjectItem) => !existingIds.has(p.id)
					);
					extraProjects = [...extraProjects, ...uniqueIncoming];
					currentPage = nextPage;
				}
			} else {
				loadMoreError = `Failed to load more projects (${res.status})`;
			}
		} catch (err: unknown) {
			loadMoreError = err instanceof Error ? err.message : 'Error loading more projects';
		} finally {
			isLoadingMore = false;
		}
	}

	let userCursusRecord = $derived.by(() => {
		if (!c || !data.profile?.cursus_users) return null;
		return data.profile.cursus_users.find((cu) => cu.cursus_id === c.id);
	});

	// Fast lookup of user's project statuses
	let userProjectMap = $derived.by(() => {
		const map = new Map<
			number,
			{ status: string; final_mark?: number | null; validated?: boolean | null }
		>();
		if (data.profile?.projects_users) {
			for (const pu of data.profile.projects_users) {
				map.set(pu.project.id, {
					status: pu.status,
					final_mark: pu.final_mark,
					validated: Boolean(pu['validated?'])
				});
			}
		}
		return map;
	});

	let isDeprecated = $derived(c?.kind?.includes('deprecated') ?? false);

	function formatDate(isoDate?: string | null) {
		if (!isoDate) return 'N/A';
		const d = new Date(isoDate);
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<div class="space-y-6">
	<!-- Back button above title -->
	<div>
		<Button
			variant="ghost"
			size="sm"
			href="/cursus"
			class="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
		>
			<ArrowLeftIcon class="h-3.5 w-3.5" />
			<span>Back to Cursuses</span>
		</Button>
	</div>

	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{c?.name || data.slug}
				</h1>
				{#if userCursusRecord}
					<Badge variant="default" class="bg-emerald-600 px-2 py-0.5 text-xs">
						<CheckCircle2Icon class="mr-1 h-3 w-3" />
						Enrolled
					</Badge>
				{/if}
			</div>
			<p class="mt-0.5 font-mono text-xs text-muted-foreground">
				{data.slug}
			</p>
		</div>

		{#if c?.kind}
			<Badge variant={isDeprecated ? 'secondary' : 'outline'} class="text-xs capitalize">
				{c.kind}
			</Badge>
		{/if}
	</div>

	{#if data.error}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{data.error}
		</div>
	{:else if c}
		<!-- Description List: Cursus Metadata -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Program Specification</h2>
			<dl
				class="grid grid-cols-1 gap-x-6 gap-y-3.5 rounded-md border p-4 text-base sm:grid-cols-2 lg:grid-cols-3"
			>
				<div>
					<dt class="text-sm font-medium text-muted-foreground">Cursus ID</dt>
					<dd class="mt-0.5 font-semibold text-foreground">#{c.id}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Slug</dt>
					<dd class="mt-0.5 truncate font-mono text-foreground">{c.slug}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Program Kind</dt>
					<dd class="mt-0.5 text-foreground capitalize">{c.kind || 'main'}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Lifecycle Status</dt>
					<dd class="mt-0.5">
						{#if isDeprecated}
							<Badge variant="secondary" class="px-2 py-0.5 text-xs">Archived / Deprecated</Badge>
						{:else}
							<Badge
								variant="outline"
								class="border-emerald-500/30 px-2 py-0.5 text-xs text-emerald-600"
							>
								Active Program
							</Badge>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Created On</dt>
					<dd class="mt-0.5 text-muted-foreground">{formatDate(c.created_at)}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Enrollment Status</dt>
					<dd class="mt-0.5 font-medium text-foreground">
						{userCursusRecord
							? `Level ${userCursusRecord.level.toFixed(2)} (${userCursusRecord.grade || 'Standard'})`
							: 'Not enrolled'}
					</dd>
				</div>
			</dl>
		</div>

		<!-- Enrolled User Stats if student is in this cursus -->
		{#if userCursusRecord}
			<div class="space-y-2">
				<h2 class="text-base font-semibold tracking-tight text-foreground">
					Your Progress in {c.name}
				</h2>
				<dl class="grid grid-cols-1 gap-3.5 rounded-md border p-4 text-base sm:grid-cols-3">
					<div>
						<dt class="text-sm font-medium text-muted-foreground">Current Level</dt>
						<dd class="mt-0.5 text-base font-bold text-foreground">
							{userCursusRecord.level.toFixed(2)}
						</dd>
					</div>

					<div>
						<dt class="text-sm font-medium text-muted-foreground">Grade</dt>
						<dd class="mt-0.5 font-medium text-foreground capitalize">
							{userCursusRecord.grade || 'In Progress'}
						</dd>
					</div>

					<div>
						<dt class="text-sm font-medium text-muted-foreground">Skills Acquired</dt>
						<dd class="mt-0.5 font-medium text-foreground">
							{userCursusRecord.skills?.length ?? 0} skills
						</dd>
					</div>
				</dl>
			</div>
		{/if}

		<!-- Cursus Projects Section with Load More -->
		<div class="space-y-3 pt-2">
			<div class="flex items-center justify-between border-b pb-2">
				<div class="flex items-center gap-2">
					<FolderGit2Icon class="h-4 w-4 text-muted-foreground" />
					<h2 class="text-base font-semibold tracking-tight text-foreground">
						Projects in this Cursus
					</h2>
					<span class="text-xs text-muted-foreground">({data.pagination.total} total)</span>
				</div>

				<div class="text-xs text-muted-foreground">
					<span>Loaded {totalLoaded} of {data.pagination.total}</span>
				</div>
			</div>

			{#if allProjects.length === 0}
				<div class="rounded-md border py-8 text-center text-sm text-muted-foreground">
					No projects found for this cursus.
				</div>
			{:else}
				<div class="divide-y overflow-hidden rounded-md border">
					{#each allProjects as p (p.id)}
						{@const userStatus = userProjectMap.get(p.id)}
						<a
							href="/projects/{p.slug}"
							class="group block flex flex-col justify-between gap-2 p-3 text-inherit transition-colors hover:bg-muted/30 sm:flex-row sm:items-center"
						>
							<div class="min-w-0 space-y-1">
								<div class="flex items-center gap-2">
									<span
										class="truncate text-sm font-medium text-foreground group-hover:text-primary group-hover:underline"
									>
										{p.name}
									</span>
									{#if p.exam}
										<Badge variant="destructive" class="px-1.5 py-0 text-xs">Exam</Badge>
									{/if}
									{#if p.parent}
										<span class="text-xs text-muted-foreground">
											(Part of {p.parent.name})
										</span>
									{/if}
								</div>
								<div class="flex items-center gap-3 text-xs text-muted-foreground">
									<span class="font-mono">{p.slug}</span>
									{#if p.difficulty !== null && p.difficulty !== undefined}
										<span>• Diff: {p.difficulty}</span>
									{/if}
									{#if p.project_sessions?.[0]?.estimate_time}
										<span class="inline-flex items-center gap-1">
											<ClockIcon class="h-3 w-3" />
											{p.project_sessions[0].estimate_time}
										</span>
									{/if}
								</div>
							</div>

							<!-- Right side: User status badge and view indicator -->
							<div class="flex shrink-0 items-center gap-2 self-start sm:self-center">
								{#if userStatus}
									{#if userStatus.status === 'finished'}
										<Badge
											variant={userStatus.validated ? 'outline' : 'destructive'}
											class="px-2 py-0.5 text-xs font-semibold {userStatus.validated
												? 'border-emerald-500/30 text-emerald-600'
												: ''}"
										>
											{userStatus.final_mark !== null && userStatus.final_mark !== undefined
												? `${userStatus.final_mark}`
												: 'Finished'}
										</Badge>
									{:else}
										<Badge variant="secondary" class="px-2 py-0.5 text-xs capitalize">
											{userStatus.status.replace(/_/g, ' ')}
										</Badge>
									{/if}
								{/if}

								<span
									class="rounded border px-2 py-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground"
								>
									View &rarr;
								</span>
							</div>
						</a>
					{/each}
				</div>

				<!-- Load More Action -->
				{#if hasMore}
					<div class="flex flex-col items-center gap-2 pt-2">
						{#if loadMoreError}
							<p class="text-xs text-destructive">{loadMoreError}</p>
						{/if}
						<Button
							variant="outline"
							size="sm"
							class="h-8 min-w-36 gap-1.5 text-xs font-medium"
							disabled={isLoadingMore}
							onclick={handleLoadMore}
						>
							{#if isLoadingMore}
								<RefreshCwIcon class="h-3.5 w-3.5 animate-spin text-primary" />
								<span>Loading more...</span>
							{:else}
								<span>Load More ({data.pagination.total - totalLoaded} remaining)</span>
							{/if}
						</Button>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
