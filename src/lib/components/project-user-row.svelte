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

<a
	href={projectHref}
	class="group block flex items-center justify-between gap-3 p-3.5 text-inherit transition-colors hover:bg-muted/30"
>
	<div class="min-w-0 space-y-1">
		<div class="flex flex-wrap items-center gap-2">
			<span class="truncate font-semibold text-foreground group-hover:underline">
				{projectUser.project.name}
			</span>
			{#if projectUser.occurrence > 0}
				<span class="text-xs text-muted-foreground">
					retry #{projectUser.occurrence}
				</span>
			{/if}
		</div>

		<div class="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
			<Badge variant={getStatusVariant(projectUser.status)} class="px-2 py-0.5 text-xs capitalize">
				{formatStatus(projectUser.status)}
			</Badge>
			{#if showDate && projectUser.updated_at}
				<span class="flex items-center gap-1">
					<ClockIcon class="h-3.5 w-3.5" />
					updated {formatDate(projectUser.updated_at)}
				</span>
			{/if}
		</div>
	</div>

	<!-- Right: Mark & Status Icon (always on the right) -->
	<div class="flex shrink-0 items-center gap-2">
		{#if projectUser.final_mark !== null && projectUser.final_mark !== undefined}
			<span
				class="flex items-center gap-1.5 text-base font-bold tabular-nums {isValidated
					? 'text-emerald-600'
					: 'text-destructive'}"
			>
				<span>{projectUser.final_mark}</span>
				{#if isValidated}
					<CheckCircle2Icon class="h-4 w-4 text-emerald-600" />
				{:else}
					<XCircleIcon class="h-4 w-4 text-destructive" />
				{/if}
			</span>
		{/if}
	</div>
</a>
