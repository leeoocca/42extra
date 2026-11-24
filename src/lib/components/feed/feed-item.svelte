<script lang="ts">
	import type { FeedItem } from '#lib/schemas/feed.js';
	import { formatActualDate } from '#lib/utils.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CompassIcon from '@lucide/svelte/icons/compass';
	import MedalIcon from '@lucide/svelte/icons/medal';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	let { item }: { item: FeedItem } = $props();

	const avatarSrc = $derived(item.actor?.image ? getCdnProxyUrl(item.actor.image) : undefined);

	const actorInitials = $derived.by(() => {
		const name = item.actor?.displayname || item.actor?.login || '?';
		return name.slice(0, 2).toUpperCase();
	});
</script>

<div class="group flex items-start gap-3.5 px-4 py-3.5">
	<!-- Left: Actor Avatar or Event Icon (without micro icon) -->
	{#if item.actor}
		<a
			href="/users/{item.actor.login}"
			class="relative shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
		>
			<Avatar.Root class="size-9">
				{#if avatarSrc}
					<Avatar.Image src={avatarSrc} alt={item.actor.login} />
				{/if}
				<Avatar.Fallback class="bg-muted text-xs font-semibold uppercase">
					{actorInitials}
				</Avatar.Fallback>
			</Avatar.Root>
		</a>
	{:else}
		<div
			class="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground ring-1 ring-border"
		>
			{#if item.kind === 'event'}
				<CalendarIcon class="size-4 text-blue-500" />
			{:else}
				<FolderGit2Icon class="size-4 text-foreground" />
			{/if}
		</div>
	{/if}

	<!-- Center: Content -->
	<div class="min-w-0 flex-1">
		<!-- Top line: Actor info & actual date -->
		<div class="flex flex-wrap items-center gap-2">
			{#if item.actor}
				<a
					href="/users/{item.actor.login}"
					class="truncate text-base font-semibold text-foreground hover:underline"
				>
					{item.actor.displayname || item.actor.login}
				</a>
				<span class="text-xs text-muted-foreground">@{item.actor.login}</span>
			{/if}

			<!-- Actual Date Timestamp (aligned to right) -->
			<span class="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
				{formatActualDate(item.timestamp)}
			</span>
		</div>

		<!-- Below: Item Type Badge + Action & Title -->
		<div class="mt-1 flex flex-wrap items-center gap-2">
			<!-- Kind Tag -->
			{#if item.kind === 'quest_user'}
				<Badge
					variant="outline"
					class="h-4.5 shrink-0 gap-1 px-1.5 py-0 text-xs font-normal text-muted-foreground"
				>
					<CompassIcon class="size-2.5 text-amber-500" />
					Quest
				</Badge>
			{:else if item.kind === 'project_user'}
				<Badge
					variant="outline"
					class="h-4.5 shrink-0 gap-1 px-1.5 py-0 text-xs font-normal text-muted-foreground"
				>
					<FolderGit2Icon class="size-2.5 text-emerald-500" />
					Project
				</Badge>
			{:else if item.kind === 'location'}
				<Badge
					variant="outline"
					class="h-4.5 shrink-0 gap-1 px-1.5 py-0 text-xs font-normal text-muted-foreground"
				>
					<MonitorIcon class="size-2.5 text-sky-500" />
					Cluster
				</Badge>
			{:else if item.kind === 'achievement_user'}
				<Badge
					variant="outline"
					class="h-4.5 shrink-0 gap-1 px-1.5 py-0 text-xs font-normal text-muted-foreground"
				>
					<MedalIcon class="size-2.5 text-purple-500" />
					Achievement
				</Badge>
			{:else if item.kind === 'event'}
				<Badge
					variant="outline"
					class="h-4.5 shrink-0 gap-1 px-1.5 py-0 text-xs font-normal text-muted-foreground"
				>
					<CalendarIcon class="size-2.5 text-blue-500" />
					Event
				</Badge>
			{/if}

			<!-- Title / Action -->
			{#if item.link}
				<a href={item.link} class="text-base text-foreground hover:underline">
					{item.title}
				</a>
			{:else}
				<span class="text-base text-foreground">
					{item.title}
				</span>
			{/if}

			<!-- Project Mark (Strict bare number, tabular-nums, icon on RIGHT) -->
			{#if item.kind === 'project_user' && item.mark !== null && item.mark !== undefined}
				<span
					class="inline-flex items-center gap-1 rounded border border-border/60 px-1.5 py-0.5 text-xs font-semibold text-foreground"
				>
					<span class="tabular-nums">{item.mark}</span>
					{#if item.isValidated}
						<CircleCheckIcon class="size-3.5 shrink-0 text-emerald-500" />
					{:else}
						<CircleXIcon class="size-3.5 shrink-0 text-destructive" />
					{/if}
				</span>
			{/if}
		</div>

		<!-- Subtitle / Context Note (strictly upright typography, no italic) -->
		{#if item.subtitle}
			<p class="mt-0.5 truncate text-xs text-muted-foreground">
				{item.subtitle}
			</p>
		{/if}
	</div>

	<!-- Right Link Arrow -->
	{#if item.link}
		<a
			href={item.link}
			class="shrink-0 self-center rounded-md p-1 text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
			aria-label="View details"
		>
			<ChevronRightIcon class="size-4" />
		</a>
	{/if}
</div>
