<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import XCircleIcon from '@lucide/svelte/icons/x-circle';
	import type { FtProjectUser } from '#lib/schemas/42.js';

	let {
		projectUser,
		login,
		showDate = true
	}: {
		projectUser: FtProjectUser;
		login?: string | null;
		showDate?: boolean;
	} = $props();

	let isValidated = $derived(Boolean(projectUser['validated?'] ?? projectUser.validated));

	let projectHref = $derived(
		login
			? `/users/${login}/projects/${projectUser.project.slug}`
			: `/projects/${projectUser.project.slug}`
	);

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

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="flex items-center justify-between p-3.5 gap-3 hover:bg-muted/30 transition-colors">
	<div class="min-w-0 space-y-1">
		<div class="flex items-center gap-2 flex-wrap">
			<a
				href={projectHref}
				class="font-semibold text-foreground hover:underline truncate"
			>
				{projectUser.project.name}
			</a>
			{#if projectUser.occurrence > 0}
				<span class="text-xs text-muted-foreground">
					retry #{projectUser.occurrence}
				</span>
			{/if}
		</div>

		<div class="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
			<Badge variant={getStatusVariant(projectUser.status)} class="text-[11px] capitalize px-2 py-0.5">
				{formatStatus(projectUser.status)}
			</Badge>
			{#if showDate && projectUser.updated_at}
				<span class="flex items-center gap-1">
					<ClockIcon class="w-3.5 h-3.5" />
					updated {formatDate(projectUser.updated_at)}
				</span>
			{/if}
		</div>
	</div>

	<!-- Right: Mark & Status Icon (always on the right) -->
	<div class="flex items-center gap-2 shrink-0">
		{#if projectUser.final_mark !== null && projectUser.final_mark !== undefined}
			<a
				href={projectHref}
				class="font-bold text-sm tabular-nums flex items-center gap-1.5 hover:underline {isValidated ? 'text-emerald-600' : 'text-destructive'}"
			>
				<span>{projectUser.final_mark}</span>
				{#if isValidated}
					<CheckCircle2Icon class="w-4 h-4 text-emerald-600" />
				{:else}
					<XCircleIcon class="w-4 h-4 text-destructive" />
				{/if}
			</a>
		{/if}
	</div>
</div>
