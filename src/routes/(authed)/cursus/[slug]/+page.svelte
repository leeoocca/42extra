<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let c = $derived(data.cursus);
	let projects = $derived(data.projects ?? []);
	let pagination = $derived(data.pagination);

	let userCursusRecord = $derived.by(() => {
		if (!c || !data.profile?.cursus_users) return null;
		return data.profile.cursus_users.find((cu) => cu.cursus_id === c.id);
	});

	// Fast lookup of user's project statuses
	let userProjectMap = $derived.by(() => {
		const map = new Map<number, { status: string; final_mark?: number | null; validated?: boolean | null }>();
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
	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b pb-4">
		<div class="flex items-center gap-3">
			<a
				href="/cursus"
				class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border rounded px-2 py-1"
			>
				<ArrowLeftIcon class="w-3 h-3" />
				Back
			</a>

			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
						{c?.name || data.slug}
					</h1>
					{#if userCursusRecord}
						<Badge variant="default" class="text-xs px-2 py-0.5 bg-emerald-600">
							<CheckCircle2Icon class="w-3 h-3 mr-1" />
							Enrolled
						</Badge>
					{/if}
				</div>
				<p class="text-xs text-muted-foreground font-mono mt-0.5">
					{data.slug}
				</p>
			</div>
		</div>

		{#if c?.kind}
			<Badge variant={isDeprecated ? 'secondary' : 'outline'} class="text-xs capitalize">
				{c.kind}
			</Badge>
		{/if}
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{data.error}
		</div>
	{:else if c}
		<!-- Description List: Cursus Metadata -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Program Specification</h2>
			<dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3.5 border rounded-md p-4 text-sm">
				<div>
					<dt class="text-xs text-muted-foreground font-medium">Cursus ID</dt>
					<dd class="font-semibold text-foreground mt-0.5">#{c.id}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Slug</dt>
					<dd class="font-mono text-foreground mt-0.5 truncate">{c.slug}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Program Kind</dt>
					<dd class="text-foreground mt-0.5 capitalize">{c.kind || 'main'}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Lifecycle Status</dt>
					<dd class="mt-0.5">
						{#if isDeprecated}
							<Badge variant="secondary" class="text-xs px-2 py-0.5">Archived / Deprecated</Badge>
						{:else}
							<Badge variant="outline" class="text-xs px-2 py-0.5 text-emerald-600 border-emerald-500/30">Active Program</Badge>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Created On</dt>
					<dd class="text-muted-foreground mt-0.5">{formatDate(c.created_at)}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Enrollment Status</dt>
					<dd class="text-foreground mt-0.5 font-medium">
						{userCursusRecord ? `Level ${userCursusRecord.level.toFixed(2)} (${userCursusRecord.grade || 'Standard'})` : 'Not enrolled'}
					</dd>
				</div>
			</dl>
		</div>

		<!-- Enrolled User Stats if student is in this cursus -->
		{#if userCursusRecord}
			<div class="space-y-2">
				<h2 class="text-base font-semibold tracking-tight text-foreground">Your Progress in {c.name}</h2>
				<dl class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 border rounded-md p-4 text-sm">
					<div>
						<dt class="text-xs text-muted-foreground font-medium">Current Level</dt>
						<dd class="font-bold text-base text-foreground mt-0.5">
							{userCursusRecord.level.toFixed(2)}
						</dd>
					</div>

					<div>
						<dt class="text-xs text-muted-foreground font-medium">Grade</dt>
						<dd class="text-foreground mt-0.5 capitalize font-medium">
							{userCursusRecord.grade || 'In Progress'}
						</dd>
					</div>

					<div>
						<dt class="text-xs text-muted-foreground font-medium">Skills Acquired</dt>
						<dd class="text-foreground mt-0.5 font-medium">
							{userCursusRecord.skills?.length ?? 0} skills
						</dd>
					</div>
				</dl>
			</div>
		{/if}

		<!-- Cursus Projects Section with Pagination -->
		<div class="space-y-3 pt-2">
			<div class="flex items-center justify-between border-b pb-2">
				<div class="flex items-center gap-2">
					<FolderGit2Icon class="w-4 h-4 text-muted-foreground" />
					<h2 class="text-base font-semibold tracking-tight text-foreground">Projects in this Cursus</h2>
					<span class="text-xs text-muted-foreground">({pagination.total} total)</span>
				</div>

				<!-- Pagination info -->
				{#if pagination.totalPages > 1}
					<div class="flex items-center gap-2 text-xs text-muted-foreground">
						<span>Page {pagination.page} of {pagination.totalPages}</span>
					</div>
				{/if}
			</div>

			{#if projects.length === 0}
				<div class="text-center py-8 border rounded-md text-sm text-muted-foreground">
					No projects found for this cursus.
				</div>
			{:else}
				<div class="border rounded-md divide-y overflow-hidden">
					{#each projects as p (p.id)}
						{@const userStatus = userProjectMap.get(p.id)}
						<div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2 hover:bg-muted/30 transition-colors">
							<div class="space-y-1 min-w-0">
								<div class="flex items-center gap-2">
									<a
										href="/projects/{p.slug}"
										class="text-sm font-medium text-foreground hover:underline hover:text-primary truncate"
									>
										{p.name}
									</a>
									{#if p.exam}
										<Badge variant="destructive" class="text-xs px-1.5 py-0">Exam</Badge>
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
											<ClockIcon class="w-3 h-3" />
											{p.project_sessions[0].estimate_time}
										</span>
									{/if}
								</div>
							</div>

							<!-- Right side: User status badge or view link -->
							<div class="flex items-center gap-2 self-start sm:self-center shrink-0">
								{#if userStatus}
									{#if userStatus.status === 'finished'}
										<Badge
											variant={userStatus.validated ? 'outline' : 'destructive'}
											class="text-xs font-semibold px-2 py-0.5 {userStatus.validated ? 'text-emerald-600 border-emerald-500/30' : ''}"
										>
											{userStatus.final_mark !== null && userStatus.final_mark !== undefined ? `${userStatus.final_mark}` : 'Finished'}
										</Badge>
									{:else}
										<Badge variant="secondary" class="text-xs px-2 py-0.5 capitalize">
											{userStatus.status.replace(/_/g, ' ')}
										</Badge>
									{/if}
								{/if}

								<a
									href="/projects/{p.slug}"
									class="text-xs text-muted-foreground hover:text-foreground border rounded px-2 py-1 transition-colors"
								>
									View &rarr;
								</a>
							</div>
						</div>
					{/each}
				</div>

				<!-- Pagination Controls -->
				{#if pagination.totalPages > 1}
					{@const pSize = pagination.pageSize ?? 30}
					<div class="flex items-center justify-between pt-2">
						<div class="text-xs text-muted-foreground">
							Showing {(pagination.page - 1) * pSize + 1}–{Math.min(pagination.page * pSize, pagination.total)} of {pagination.total} projects
						</div>

						<div class="flex items-center gap-1.5">
							{#if pagination.page > 1}
								<Button
									href="?page={pagination.page - 1}"
									variant="outline"
									size="sm"
									class="h-7 px-2.5 text-xs font-medium"
								>
									<ChevronLeftIcon class="w-3.5 h-3.5" />
									Previous
								</Button>
							{:else}
								<Button
									variant="outline"
									size="sm"
									disabled
									class="h-7 px-2.5 text-xs font-medium opacity-50 cursor-not-allowed"
								>
									<ChevronLeftIcon class="w-3.5 h-3.5" />
									Previous
								</Button>
							{/if}

							<span class="text-xs px-2 font-medium">
								{pagination.page} / {pagination.totalPages}
							</span>

							{#if pagination.page < pagination.totalPages}
								<Button
									href="?page={pagination.page + 1}"
									variant="outline"
									size="sm"
									class="h-7 px-2.5 text-xs font-medium"
								>
									Next
									<ChevronRightIcon class="w-3.5 h-3.5" />
								</Button>
							{:else}
								<Button
									variant="outline"
									size="sm"
									disabled
									class="h-7 px-2.5 text-xs font-medium opacity-50 cursor-not-allowed"
								>
									Next
									<ChevronRightIcon class="w-3.5 h-3.5" />
								</Button>
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
