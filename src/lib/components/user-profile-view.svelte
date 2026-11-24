<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import ProjectUserRow from '#lib/components/project-user-row.svelte';
	import { friendsStore } from '#lib/state/friends.svelte.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import UserMinusIcon from '@lucide/svelte/icons/user-minus';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';
	import type { FtUserMe } from '#lib/schemas/42.js';

	let {
		profile,
		isCurrentUser = false,
		backHref,
		backLabel = 'Back to Clusters'
	}: {
		profile: FtUserMe;
		isCurrentUser?: boolean;
		backHref?: string | null;
		backLabel?: string;
	} = $props();

	let isAvatarModalOpen = $state(false);
	let copiedJson = $state(false);

	let avatarUrl = $derived.by(() => {
		const raw =
			profile?.image?.link ?? profile?.image?.versions?.medium ?? profile?.image?.versions?.small;
		return raw ? (getCdnProxyUrl(raw) ?? null) : null;
	});

	let largeAvatarUrl = $derived.by(() => {
		const raw =
			profile?.image?.versions?.large ?? profile?.image?.link ?? profile?.image?.versions?.medium;
		return raw ? (getCdnProxyUrl(raw) ?? null) : null;
	});

	let primaryCampus = $derived.by(() => {
		const pc = profile?.campus_users?.find((cu) => cu.is_primary);
		return (
			profile?.campus?.find((c) => c.id === pc?.campus_id)?.name ??
			profile?.campus?.[0]?.name ??
			'N/A'
		);
	});

	let poolDisplay = $derived.by(() => {
		if (!profile?.pool_month || !profile?.pool_year) return 'N/A';
		return `${profile.pool_month.charAt(0).toUpperCase() + profile.pool_month.slice(1)} ${profile.pool_year}`;
	});

	function formatDate(iso?: string | null) {
		if (!iso) return 'N/A';
		return new Date(iso).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	async function handleCopyJson() {
		if (!profile) return;
		try {
			await navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
			copiedJson = true;
			setTimeout(() => {
				copiedJson = false;
			}, 2000);
		} catch (e) {
			console.error('Failed to copy JSON:', e);
		}
	}
</script>

<div class="space-y-6">
	<!-- Optional back button above title -->
	{#if backHref}
		<div>
			<Button
				variant="ghost"
				size="sm"
				href={backHref}
				class="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
			>
				<ArrowLeftIcon class="h-3.5 w-3.5" />
				<span>{backLabel}</span>
			</Button>
		</div>
	{/if}

	<!-- Top Header Bar -->
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div class="flex items-center gap-3">
			{#if avatarUrl}
				<button
					type="button"
					onclick={() => (isAvatarModalOpen = true)}
					class="relative rounded-full border p-0 transition-opacity hover:opacity-85 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
					title="View larger profile image"
				>
					<img
						src={avatarUrl}
						alt={profile?.login ?? 'User'}
						class="h-10 w-10 rounded-full object-cover"
					/>
				</button>
			{:else}
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-bold"
				>
					{profile?.login?.slice(0, 2).toUpperCase() ?? '42'}
				</div>
			{/if}

			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
						{profile?.usual_full_name || profile?.displayname || profile?.login || 'User Profile'}
					</h1>
					{#if profile?.login}
						<Badge variant="outline" class="font-mono text-xs">
							@{profile.login}
						</Badge>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex items-center gap-2">
			{#if isCurrentUser}
				<Button variant="outline" size="sm" class="h-8 text-xs" onclick={handleCopyJson}>
					{#if copiedJson}
						<CheckIcon class="mr-1 h-3.5 w-3.5 text-emerald-600" />
						Copied
					{:else}
						<CopyIcon class="mr-1 h-3.5 w-3.5" />
						JSON
					{/if}
				</Button>
			{:else if profile?.id}
				{@const isFriend = friendsStore.isFriend(profile.id)}
				<Button
					variant={isFriend ? 'secondary' : 'outline'}
					size="sm"
					class="h-8 shrink-0 gap-1.5 text-xs"
					onclick={() => profile?.id && friendsStore.toggleFriend(profile.id)}
				>
					{#if isFriend}
						<UserMinusIcon class="h-3.5 w-3.5 text-muted-foreground" />
						<span>Remove Friend</span>
					{:else}
						<UserPlusIcon class="h-3.5 w-3.5" />
						<span>Add Friend</span>
					{/if}
				</Button>
			{/if}
		</div>
	</div>

	<!-- Description List: Record Details -->
	<div class="space-y-2">
		<h2 class="text-base font-semibold tracking-tight text-foreground">Record Details</h2>
		<dl
			class="grid grid-cols-1 gap-x-6 gap-y-3.5 rounded-md border p-4 text-base sm:grid-cols-2 lg:grid-cols-3"
		>
			<div>
				<dt class="text-sm font-medium text-muted-foreground">Login</dt>
				<dd class="mt-0.5 font-mono font-semibold text-foreground">
					{profile?.login || 'N/A'}
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Email</dt>
				<dd class="mt-0.5 truncate font-medium text-foreground">
					{profile?.email || 'N/A'}
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Kind</dt>
				<dd class="mt-0.5 font-medium text-foreground capitalize">
					{profile?.kind || 'student'}
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Primary Campus</dt>
				<dd class="mt-0.5 font-medium text-foreground">
					<a href="/campuses" class="hover:underline">
						{primaryCampus}
					</a>
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Active Workstation</dt>
				<dd class="mt-0.5">
					{#if profile?.location}
						<a
							href="/clusters"
							class="inline-flex items-center gap-1 font-mono font-semibold text-emerald-600 hover:underline"
							title="View clusters"
						>
							<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
							{profile.location}
						</a>
					{:else}
						<span class="text-muted-foreground">Unavailable (Off-campus)</span>
					{/if}
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Pool</dt>
				<dd class="mt-0.5 font-medium text-foreground">
					{poolDisplay}
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Wallet Balance</dt>
				<dd class="mt-0.5 font-semibold text-foreground">
					{profile?.wallet ?? 0} ₳
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Evaluation Points</dt>
				<dd class="mt-0.5 font-semibold text-foreground">
					{profile?.correction_point ?? 0} points
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Created</dt>
				<dd class="mt-0.5 text-muted-foreground">
					{formatDate(profile?.created_at)}
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Status Flags</dt>
				<dd class="mt-0.5 flex flex-wrap items-center gap-2">
					{#if profile?.['staff?']}
						<Badge variant="default" class="px-2 py-0.5 text-xs">Staff</Badge>
					{/if}
					{#if profile?.['alumni?']}
						<Badge variant="secondary" class="px-2 py-0.5 text-xs">Alumni</Badge>
					{/if}
					{#if profile?.['active?']}
						<Badge
							variant="outline"
							class="border-emerald-500/30 px-2 py-0.5 text-xs text-emerald-600"
						>
							Active
						</Badge>
					{/if}
				</dd>
			</div>

			<div>
				<dt class="text-sm font-medium text-muted-foreground">Total Achievements</dt>
				<dd class="mt-0.5 font-medium text-foreground">
					<a href="/achievements" class="text-primary hover:underline">
						{profile?.achievements?.length ?? 0} badges unlocked &rarr;
					</a>
				</dd>
			</div>
		</dl>
	</div>

	<!-- Cursus Progress -->
	<div class="space-y-2">
		<h2 class="text-base font-semibold tracking-tight text-foreground">Cursus Progress</h2>
		{#if !profile?.cursus_users || profile.cursus_users.length === 0}
			<p class="rounded-md border p-4 text-sm text-muted-foreground">
				No enrolled cursus recorded.
			</p>
		{:else}
			<div class="divide-y rounded-md border text-base">
				{#each profile.cursus_users as cu}
					{@const cursusHref = cu.cursus?.slug ? `/cursus/${cu.cursus.slug}` : null}
					{#if cursusHref}
						<a
							href={cursusHref}
							class="group block flex items-center justify-between gap-3 p-3.5 text-inherit transition-colors hover:bg-muted/30"
						>
							<div class="min-w-0 space-y-0.5">
								<div class="flex items-center gap-2">
									<span class="font-semibold text-foreground group-hover:underline">
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
						</a>
					{:else}
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
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<!-- Projects Section -->
	{#if profile?.projects_users && profile.projects_users.length > 0}
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">
				Projects ({profile.projects_users.length})
			</h2>
			<div class="divide-y rounded-md border text-base">
				{#each profile.projects_users as p}
					<ProjectUserRow projectUser={p} login={profile.login} showDate={false} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- Avatar Modal Dialog -->
{#if largeAvatarUrl || avatarUrl}
	<Dialog.Root bind:open={isAvatarModalOpen}>
		<Dialog.Content class="p-4 text-center sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title class="text-base font-semibold">
					{profile?.usual_full_name || profile?.displayname || profile?.login || 'Profile Picture'}
				</Dialog.Title>
				{#if profile?.login}
					<Dialog.Description class="font-mono text-xs text-muted-foreground">
						@{profile.login}
					</Dialog.Description>
				{/if}
			</Dialog.Header>
			<div class="mt-2 flex items-center justify-center overflow-hidden rounded-lg bg-muted/20 p-2">
				<img
					src={largeAvatarUrl ?? avatarUrl}
					alt={profile?.login ?? 'User'}
					class="max-h-[75vh] w-auto rounded-md object-contain shadow-sm"
				/>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
