<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let p = $derived(data.project);

	let activeSession = $derived(p?.project_sessions?.[0]);

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
				href="/projects"
				class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border rounded px-2 py-1"
			>
				<ArrowLeftIcon class="w-3 h-3" />
				Back
			</a>

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
						<div class="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
							<a href={`/projects/${child.slug}`} class="font-medium text-foreground hover:underline">
								{child.name}
							</a>
							<span class="text-muted-foreground text-xs">#{child.id}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
