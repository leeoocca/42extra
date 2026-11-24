<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { friendsStore } from '#lib/state/friends.svelte.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import XCircleIcon from '@lucide/svelte/icons/x-circle';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import UserMinusIcon from '@lucide/svelte/icons/user-minus';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let u = $derived(data.userProfile);
	let isAvatarModalOpen = $state(false);

	let primaryCampus = $derived.by(() => {
		const pc = u?.campus_users?.find((cu) => cu.is_primary);
		return u?.campus?.find((c) => c.id === pc?.campus_id)?.name ?? u?.campus?.[0]?.name ?? 'N/A';
	});

	let poolDisplay = $derived.by(() => {
		if (!u?.pool_month || !u?.pool_year) return 'N/A';
		return `${u.pool_month.charAt(0).toUpperCase() + u.pool_month.slice(1)} ${u.pool_year}`;
	});

	let avatarUrl = $derived.by(() => {
		const raw = u?.image?.link ?? u?.image?.versions?.medium ?? u?.image?.versions?.small;
		return raw ? (getCdnProxyUrl(raw) ?? null) : null;
	});

	let largeAvatarUrl = $derived.by(() => {
		const raw = u?.image?.versions?.large ?? u?.image?.link ?? u?.image?.versions?.medium;
		return raw ? (getCdnProxyUrl(raw) ?? null) : null;
	});

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
				href="/clusters"
				class="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
			>
				<ArrowLeftIcon class="h-3 w-3" />
				Back
			</a>
			{#if avatarUrl}
				<button
					type="button"
					onclick={() => (isAvatarModalOpen = true)}
					class="relative rounded-full border p-0 transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					title="View larger profile image"
				>
					<img
						src={avatarUrl}
						alt={u?.login ?? data.login}
						class="h-10 w-10 rounded-full object-cover"
					/>
				</button>
			{:else}
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-bold"
				>
					{data.login.slice(0, 2).toUpperCase()}
				</div>
			{/if}

			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
						{u?.usual_full_name || u?.displayname || data.login}
					</h1>
					<Badge variant="outline" class="font-mono text-xs">
						@{data.login}
					</Badge>
				</div>
				<p class="mt-0.5 text-xs text-muted-foreground">Student record and achievements.</p>
			</div>
		</div>

		{#if u?.id}
			{@const isFriend = friendsStore.isFriend(u.id)}
			<Button
				variant={isFriend ? 'secondary' : 'outline'}
				size="sm"
				class="gap-1.5 h-8 text-xs shrink-0"
				onclick={() => u?.id && friendsStore.toggleFriend(u.id)}
			>
				{#if isFriend}
					<UserMinusIcon class="w-3.5 h-3.5 text-muted-foreground" />
					<span>Remove Friend</span>
				{:else}
					<UserPlusIcon class="w-3.5 h-3.5" />
					<span>Add Friend</span>
				{/if}
			</Button>
		{/if}
	</div>

	{#if data.error}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{data.error}
		</div>
	{:else if u}
		<!-- Description List: User Details -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">User Information</h2>
			<dl
				class="grid grid-cols-1 gap-x-6 gap-y-3.5 rounded-md border p-4 text-sm sm:grid-cols-2 lg:grid-cols-3"
			>
				<div>
					<dt class="text-xs font-medium text-muted-foreground">Login</dt>
					<dd class="mt-0.5 font-mono font-semibold text-foreground">
						{u.login}
					</dd>
				</div>

				<div>
					<dt class="text-xs font-medium text-muted-foreground">Email</dt>
					<dd class="mt-0.5 truncate font-medium text-foreground">
						{u.email || 'N/A'}
					</dd>
				</div>

				<div>
					<dt class="text-xs font-medium text-muted-foreground">Kind</dt>
					<dd class="mt-0.5 font-medium text-foreground capitalize">
						{u.kind || 'student'}
					</dd>
				</div>

				<div>
					<dt class="text-xs font-medium text-muted-foreground">Primary Campus</dt>
					<dd class="mt-0.5 font-medium text-foreground">
						{primaryCampus}
					</dd>
				</div>

				<div>
					<dt class="text-xs font-medium text-muted-foreground">Current Workstation</dt>
					<dd class="mt-0.5">
						{#if u.location}
							<span class="inline-flex items-center gap-1 font-mono font-semibold text-emerald-600">
								<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
								{u.location}
							</span>
						{:else}
							<span class="text-muted-foreground">Not logged in</span>
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
					<dt class="text-xs font-medium text-muted-foreground">Wallet</dt>
					<dd class="mt-0.5 font-semibold text-foreground">
						{u.wallet ?? 0} ₳
					</dd>
				</div>

				<div>
					<dt class="text-xs font-medium text-muted-foreground">Evaluation Points</dt>
					<dd class="mt-0.5 font-semibold text-foreground">
						{u.correction_point ?? 0} points
					</dd>
				</div>

				<div>
					<dt class="text-xs font-medium text-muted-foreground">Created</dt>
					<dd class="mt-0.5 text-muted-foreground">
						{formatDate(u.created_at)}
					</dd>
				</div>

				<div>
					<dt class="text-xs font-medium text-muted-foreground">Status Flags</dt>
					<dd class="mt-0.5 flex flex-wrap items-center gap-2">
						{#if u['staff?']}
							<Badge variant="default" class="px-2 py-0.5 text-xs">Staff</Badge>
						{/if}
						{#if u['alumni?']}
							<Badge variant="secondary" class="px-2 py-0.5 text-xs">Alumni</Badge>
						{/if}
						{#if u['active?']}
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
					<dt class="text-xs font-medium text-muted-foreground">Achievements</dt>
					<dd class="mt-0.5 font-medium text-foreground">
						{u.achievements?.length ?? 0} badges unlocked
					</dd>
				</div>
			</dl>
		</div>

		<!-- Cursus Progress -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Cursus Enrolled</h2>
			{#if !u.cursus_users || u.cursus_users.length === 0}
				<p class="rounded-md border p-4 text-sm text-muted-foreground">
					No enrolled cursus recorded.
				</p>
			{:else}
				<div class="divide-y rounded-md border text-sm">
					{#each u.cursus_users as cu}
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

		<!-- Projects -->
		{#if u.projects_users && u.projects_users.length > 0}
			<div class="space-y-2">
				<h2 class="text-base font-semibold tracking-tight text-foreground">
					Projects ({u.projects_users.length})
				</h2>
				<div class="divide-y rounded-md border text-sm">
					{#each u.projects_users as p}
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

							<div class="flex shrink-0 items-center gap-3 text-sm">
								<a
									href={`/users/${data.login}/projects/${p.project.slug}`}
									class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
								>
									evaluations &rarr;
								</a>

								{#if p.final_mark !== null && p.final_mark !== undefined}
									<a
										href={`/users/${data.login}/projects/${p.project.slug}`}
										class="font-semibold {p['validated?']
											? 'text-emerald-600'
											: 'text-destructive'} flex items-center gap-1 tabular-nums hover:underline"
									>
										{p.final_mark}
										{#if p['validated?']}
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
			</div>
		{/if}
	{/if}
</div>

<!-- Avatar Modal Dialog -->
{#if largeAvatarUrl || avatarUrl}
	<Dialog.Root bind:open={isAvatarModalOpen}>
		<Dialog.Content class="sm:max-w-md p-4 text-center">
			<Dialog.Header>
				<Dialog.Title class="text-base font-semibold">
					{u?.usual_full_name || u?.displayname || `@${data.login}`}
				</Dialog.Title>
				<Dialog.Description class="text-xs text-muted-foreground font-mono">
					@{data.login}
				</Dialog.Description>
			</Dialog.Header>
			<div class="mt-2 flex items-center justify-center overflow-hidden rounded-lg bg-muted/20 p-2">
				<img
					src={largeAvatarUrl ?? avatarUrl}
					alt={u?.login ?? data.login}
					class="max-h-[75vh] w-auto rounded-md object-contain shadow-sm"
				/>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
