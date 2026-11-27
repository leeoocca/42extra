<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Avatar from '#lib/components/ui/avatar/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import XCircleIcon from '@lucide/svelte/icons/x-circle';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import UserIcon from '@lucide/svelte/icons/user';
	import UsersIcon from '@lucide/svelte/icons/users';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';
	import StarIcon from '@lucide/svelte/icons/star';
	import type { PageData } from './$types';
	import { formatDuration } from '#lib/time.ts';

	let { data }: { data: PageData } = $props();

	let userProfiles = $state<Record<string, { avatar?: string; displayname?: string }>>({});

	$effect(() => {
		let active = true;
		userProfiles = {};
		data.userProfiles.then((p) => {
			if (active) userProfiles = p;
		});
		return () => {
			active = false;
		};
	});

	let pu = $derived(data.projectsUser);
	let projectName = $derived(data.project?.name || pu?.project?.name || data.slug);
	let isExam = $derived(data.project?.exam ?? false);

	function formatDate(isoDate?: string | null) {
		if (!isoDate) return 'N/A';
		const d = new Date(isoDate);
		return d.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getFlagVariant(
		name?: string,
		positive?: boolean
	): 'default' | 'destructive' | 'secondary' | 'outline' {
		if (positive === false || name?.toLowerCase() === 'cheat' || name?.toLowerCase() === 'crash') {
			return 'destructive';
		}
		if (name?.toLowerCase() === 'ok' || positive === true) {
			return 'default';
		}
		return 'outline';
	}
</script>

<div class="space-y-6">
	<!-- Back button above title -->
	<div>
		<Button
			variant="ghost"
			size="sm"
			href={`/users/${data.login}`}
			class="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
		>
			<ArrowLeftIcon class="h-3.5 w-3.5" />
			<span>Back to @{data.login}</span>
		</Button>
	</div>

	<!-- Page Header -->
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex flex-wrap items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{projectName}
				</h1>
				<a
					href={`/users/${data.login}`}
					class="font-mono text-xs text-muted-foreground hover:text-foreground hover:underline"
				>
					@{data.login}
				</a>
				{#if isExam}
					<Badge variant="destructive" class="px-2 py-0.5 text-xs uppercase">Exam</Badge>
				{/if}
			</div>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<a
				href={`/projects/${data.slug}`}
				class="inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
			>
				Project Spec &rarr;
			</a>
		</div>
	</div>

	{#if data.error}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
		>
			{data.error}
		</div>
	{:else if pu}
		<!-- Description List: User Project Overview -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Submission Record</h2>
			<dl
				class="grid grid-cols-1 gap-x-6 gap-y-3 rounded-md border p-4 text-base sm:grid-cols-2 lg:grid-cols-4"
			>
				<div>
					<dt class="text-sm font-medium text-muted-foreground">Student</dt>
					<dd class="mt-0.5 font-medium text-foreground">
						<a href={`/users/${data.login}`} class="hover:underline">
							{data.user?.usual_full_name || data.user?.displayname || data.login}
							<span class="ml-1 font-mono text-xs text-muted-foreground">@{data.login}</span>
						</a>
					</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Final Mark</dt>
					<dd class="mt-0.5 flex items-center gap-1.5 font-semibold text-foreground">
						{#if pu.final_mark !== null && pu.final_mark !== undefined}
							{@const isValidated = Boolean(pu['validated?'] ?? pu.validated)}
							<span class="tabular-nums {isValidated ? 'text-emerald-600' : 'text-destructive'}">
								{pu.final_mark}
							</span>
							{#if isValidated}
								<Badge variant="default" class="bg-emerald-600 px-1.5 py-0 text-xs">
									Validated
								</Badge>
							{:else}
								<Badge variant="destructive" class="px-1.5 py-0 text-xs">Failed</Badge>
							{/if}
						{:else}
							<span class="text-muted-foreground">In Progress</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Status & Retries</dt>
					<dd class="mt-0.5 text-foreground capitalize">
						{pu.status.replace(/_/g, ' ')}
						{#if pu.occurrence > 0}
							<span class="ml-1 text-xs text-muted-foreground">(retry #{pu.occurrence})</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Marked Date</dt>
					<dd class="mt-0.5 text-muted-foreground">
						{formatDate(pu.marked_at || pu.updated_at)}
					</dd>
				</div>
			</dl>
		</div>

		<!-- Teams and Scales (Evaluations) Section -->
		<div class="space-y-4">
			<div class="flex items-center justify-between border-b pb-2">
				<h2 class="text-base font-semibold tracking-tight text-foreground">
					Teams & Scale Evaluations ({data.teams.length})
				</h2>
			</div>

			{#if data.teams.length === 0}
				<div class="space-y-1 rounded-md border p-6 text-center text-sm text-muted-foreground">
					<p class="font-medium">No team submissions recorded</p>
					<p class="text-xs">No scale evaluations have been conducted yet.</p>
				</div>
			{:else}
				<div class="space-y-6">
					{#each data.teams as team, idx}
						<div class="space-y-2">
							<!-- Team Header / Minimal Status Row (No wrapper card) -->
							<div
								class="flex flex-col justify-between gap-2 border-b pb-1.5 text-xs sm:flex-row sm:items-center"
							>
								<div class="flex flex-wrap items-center gap-2">
									<UsersIcon class="h-3.5 w-3.5 text-muted-foreground" />
									<span class="text-base font-semibold text-foreground">
										{team.name}
									</span>
									<span class="text-muted-foreground">
										#{team.id}
									</span>
									{#if team.status}
										<Badge variant="outline" class="px-1.5 py-0 text-xs capitalize">
											{team.status.replace(/_/g, ' ')}
										</Badge>
									{/if}
								</div>

								<div class="flex items-center gap-3 text-muted-foreground">
									{#if team.final_mark !== null && team.final_mark !== undefined}
										<span
											class="text-sm font-bold tabular-nums {team['validated?']
												? 'text-emerald-600'
												: 'text-foreground'}"
										>
											Mark: {team.final_mark}
										</span>
									{/if}
									{#if team.closed_at}
										<span>closed {formatDate(team.closed_at)}</span>
									{/if}
								</div>
							</div>

							<!-- Git repository if present -->
							{#if team.repo_url}
								<div class="flex items-center gap-2 py-0.5 text-xs text-muted-foreground">
									<GitBranchIcon class="h-3 w-3 shrink-0 text-muted-foreground" />
									<span class="truncate font-mono text-xs select-all">{team.repo_url}</span>
								</div>
							{/if}

							<!-- Team Members (with avatars) -->
							{#if team.users && team.users.length > 0}
								<div class="flex flex-wrap items-center gap-3 py-1.5 text-xs">
									<span class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
										Team:
									</span>
									<div class="flex flex-wrap items-center gap-2">
										{#each team.users as u}
											{@const uProfile = userProfiles?.[u.login]}
											{@const memberAvatar = uProfile?.avatar
												? getCdnProxyUrl(uProfile.avatar)
												: null}
											<a
												href={`/users/${u.login}`}
												class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 transition-colors hover:border-primary/40 hover:bg-muted/70"
											>
												<Avatar.Root class="size-4 shrink-0">
													{#if memberAvatar}
														<Avatar.Image src={memberAvatar} alt={u.login} />
													{/if}
													<Avatar.Fallback class="bg-muted text-[9px] font-semibold uppercase">
														{u.login.slice(0, 2)}
													</Avatar.Fallback>
												</Avatar.Root>
												<span class="font-medium text-foreground">
													{u.login}
												</span>
												{#if u.leader}
													<span class="text-xs font-semibold text-amber-600">(Leader)</span>
												{/if}
											</a>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Scale Teams (Evaluations) -->
							<div class="pt-1">
								{#if !team.scale_teams || team.scale_teams.length === 0}
									<p class="py-1 text-xs text-muted-foreground italic">
										No evaluations registered for this attempt.
									</p>
								{:else}
									<div class="space-y-4 divide-y">
										{#each team.scale_teams as st}
											{@const hasHighMark =
												typeof st.final_mark === 'number' && st.final_mark >= 100}
											{@const flagName = st.flag?.name || (hasHighMark ? 'Ok' : '')}
											{@const correctorLogin = st.corrector?.login}
											{@const correctorProfile = correctorLogin
												? userProfiles?.[correctorLogin]
												: null}
											{@const correctorAvatar = correctorProfile?.avatar
												? getCdnProxyUrl(correctorProfile.avatar)
												: null}
											{@const studentProfile = userProfiles?.[data.login]}
											{@const studentAvatar = studentProfile?.avatar
												? getCdnProxyUrl(studentProfile.avatar)
												: null}

											<div class="space-y-2.5 py-3 first:pt-1">
												<div class="flex items-center justify-between">
													<div class="flex items-center gap-2">
														<a class="flex items-center gap-2.5" href={`/users/${correctorLogin}`}>
															<Avatar.Root>
																{#if correctorAvatar}
																	<Avatar.Image
																		src={correctorAvatar}
																		alt={correctorLogin || 'Evaluator'}
																	/>
																{/if}
																<Avatar.Fallback class="bg-muted text-xs font-semibold uppercase">
																	{correctorLogin ? correctorLogin.slice(0, 2) : '?'}
																</Avatar.Fallback>
															</Avatar.Root>

															<div class="min-w-0 flex-1 space-y-1">
																<div class="flex items-center gap-2">
																	{#if correctorLogin}
																		<span class="font-semibold text-foreground hover:underline">
																			{correctorLogin}
																		</span>
																	{:else}
																		<span class="font-semibold text-foreground">Moulinette</span>
																	{/if}
																</div>
															</div>
														</a>
														<span class="text-xs text-muted-foreground">
															{formatDate(st.begin_at)} – {formatDate(st.filled_at)}
															{#if st.begin_at && st.filled_at}
																({formatDuration(st.begin_at, st.filled_at)})
															{/if}
														</span>
													</div>

													<div class="flex items-center gap-2">
														{#if flagName}
															<Badge
																variant={getFlagVariant(st.flag?.name, st.flag?.positive)}
																class="px-1.5 py-0 text-xs font-normal"
															>
																{flagName}
															</Badge>
														{/if}
														{#if st.final_mark !== null && st.final_mark !== undefined}
															<span
																class="text-sm font-bold tabular-nums {st.final_mark >= 100
																	? 'text-emerald-600'
																	: st.final_mark > 0
																		? 'text-amber-600'
																		: 'text-destructive'}"
															>
																{st.final_mark}
															</span>
														{/if}
													</div>
												</div>
												<div
													class="ml-8 rounded-lg bg-muted/40 p-3 text-sm leading-relaxed wrap-break-word whitespace-pre-line text-foreground"
												>
													{st.comment || 'No written evaluation comment provided.'}
												</div>

												{#if st.feedback}
													<div class="flex items-center gap-2.5">
														<Avatar.Root>
															{#if studentAvatar}
																<Avatar.Image src={studentAvatar} alt={data.login} />
															{/if}
															<Avatar.Fallback
																class="bg-primary/10 text-xs font-semibold text-primary uppercase"
															>
																{data.login.slice(0, 2)}
															</Avatar.Fallback>
														</Avatar.Root>

														<div class="min-w-0 flex-1 space-y-1">
															<div class="flex items-center justify-between gap-2">
																<div class="flex items-center gap-1.5">
																	<span class="font-semibold text-foreground">{data.login}</span>
																</div>
															</div>
														</div>
													</div>
													<div
														class="ml-8 rounded-lg bg-muted/40 p-3 text-sm leading-relaxed wrap-break-word whitespace-pre-line text-foreground"
													>
														{st.feedback || 'No written feedback comment provided.'}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
