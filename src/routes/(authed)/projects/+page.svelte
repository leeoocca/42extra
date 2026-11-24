<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import UsersIcon from '@lucide/svelte/icons/users';
	import type { PageData } from './$types';
	import type { FtProjectUser } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	let profile = $derived(data.profile);

	// Extract active projects (not finished)
	let activeProjects = $derived.by(() => {
		if (!profile?.projects_users) return [];
		return profile.projects_users.filter((p) => p.status !== 'finished');
	});

	// Cursus ID to Cursus name map
	let cursusMap = $derived.by(() => {
		const map = new Map<number, string>();
		if (profile?.cursus_users) {
			for (const cu of profile.cursus_users) {
				if (cu.cursus) {
					map.set(cu.cursus_id, cu.cursus.name);
				}
			}
		}
		return map;
	});

	// Group active projects by cursus
	let groupedProjects = $derived.by(() => {
		const groups = new Map<string, { cursusId: number | null; projects: FtProjectUser[] }>();

		for (const pu of activeProjects) {
			const cursusId = pu.cursus_ids?.[0] ?? null;
			const cursusName = cursusId ? cursusMap.get(cursusId) ?? `Cursus #${cursusId}` : 'Other Cursus';

			if (!groups.has(cursusName)) {
				groups.set(cursusName, { cursusId, projects: [] });
			}
			groups.get(cursusName)!.projects.push(pu);
		}

		return Array.from(groups.entries()).map(([name, group]) => ({
			cursusName: name,
			cursusId: group.cursusId,
			projects: group.projects
		}));
	});

	function formatStatus(status: string) {
		return status.replace(/_/g, ' ');
	}

	function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
		switch (status) {
			case 'in_progress':
				return 'default';
			case 'waiting_for_correction':
				return 'secondary';
			case 'searching_a_group':
			case 'creating_group':
				return 'outline';
			default:
				return 'secondary';
		}
	}

	function formatDate(isoDate?: string | null) {
		if (!isoDate) return '';
		const d = new Date(isoDate);
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between border-b pb-4">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Active Projects</h1>
			<p class="text-xs text-muted-foreground mt-0.5">
				Current registered and in-progress projects grouped by cursus.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<Badge variant="outline" class="text-xs">
				{activeProjects.length} active
			</Badge>
		</div>
	</div>

	{#if activeProjects.length === 0}
		<div class="border rounded-md p-6 text-center text-muted-foreground text-sm space-y-1">
			<p class="font-medium">No active projects found</p>
			<p class="text-xs">All registered projects are either validated or finished.</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each groupedProjects as group}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h2 class="text-base font-semibold tracking-tight flex items-center gap-2">
							<FolderGit2Icon class="w-4 h-4 text-muted-foreground" />
							{group.cursusName}
						</h2>
						<span class="text-xs text-muted-foreground">
							{group.projects.length} project{group.projects.length === 1 ? '' : 's'}
						</span>
					</div>

					<div class="border rounded-md divide-y text-sm">
						{#each group.projects as item}
							<div class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2 hover:bg-muted/30 transition-colors">
								<div class="min-w-0 space-y-1">
									<div class="flex items-center gap-2 flex-wrap">
										<a
											href={`/projects/${item.project.slug}`}
											class="font-semibold text-foreground hover:underline"
										>
											{item.project.name}
										</a>
										<a
											href={`https://projects.intra.42.fr/projects/${item.project.slug}`}
											target="_blank"
											rel="noreferrer"
											title="Open in 42 Intra"
											class="text-muted-foreground hover:text-foreground inline-flex items-center"
										>
											<ExternalLinkIcon class="w-3.5 h-3.5" />
										</a>
										<Badge variant={getStatusVariant(item.status)} class="text-xs capitalize px-2 py-0.5">
											{formatStatus(item.status)}
										</Badge>
										{#if item.occurrence > 0}
											<span class="text-xs text-muted-foreground">
												retry #{item.occurrence}
											</span>
										{/if}
									</div>

									<div class="flex items-center gap-4 text-xs text-muted-foreground">
										{#if item.current_team_id}
											<span class="flex items-center gap-1">
												<UsersIcon class="w-3.5 h-3.5" />
												team #{item.current_team_id}
											</span>
										{/if}
										{#if item.updated_at}
											<span class="flex items-center gap-1">
												<ClockIcon class="w-3.5 h-3.5" />
												updated {formatDate(item.updated_at)}
											</span>
										{/if}
										{#if item.final_mark !== null && item.final_mark !== undefined}
											{@const isValidated = Boolean(item['validated?'] ?? item.validated)}
											<span class="flex items-center gap-1 font-semibold {isValidated ? 'text-green-600' : 'text-red-500'}">
												<CheckCircleIcon class="w-3.5 h-3.5" />
												{item.final_mark}
											</span>
										{/if}
									</div>
								</div>

								<div class="sm:text-right shrink-0">
									<a
										href={`/projects/${item.project.slug}`}
										class="text-xs text-primary hover:underline font-medium"
									>
										details &rarr;
									</a>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
