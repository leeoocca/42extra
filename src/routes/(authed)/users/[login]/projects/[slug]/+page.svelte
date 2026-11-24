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

	let { data }: { data: PageData } = $props();

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

	function getFlagVariant(name?: string, positive?: boolean): 'default' | 'destructive' | 'secondary' | 'outline' {
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
			class="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
		>
			<ArrowLeftIcon class="w-3.5 h-3.5" />
			<span>Back to @{data.login}</span>
		</Button>
	</div>

	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div>
			<div class="flex items-center gap-2 flex-wrap">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{projectName}
				</h1>
				<a
					href={`/users/${data.login}`}
					class="text-xs font-mono text-muted-foreground hover:text-foreground hover:underline"
				>
					@{data.login}
				</a>
				{#if isExam}
					<Badge variant="destructive" class="text-xs uppercase px-2 py-0.5">
						Exam
					</Badge>
				{/if}
			</div>
		</div>

		<div class="flex items-center gap-2 flex-wrap">
			<a
				href={`/projects/${data.slug}`}
				class="text-xs border rounded px-2.5 py-1.5 text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1.5"
			>
				Project Spec &rarr;
			</a>
		</div>
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-4 text-sm">
			{data.error}
		</div>
	{:else if pu}
		<!-- Description List: User Project Overview -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Submission Record</h2>
			<dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 border rounded-md p-4 text-sm">
				<div>
					<dt class="text-xs text-muted-foreground font-medium">Student</dt>
					<dd class="mt-0.5 font-medium text-foreground">
						<a href={`/users/${data.login}`} class="hover:underline">
							{data.user?.usual_full_name || data.user?.displayname || data.login}
							<span class="font-mono text-xs text-muted-foreground ml-1">@{data.login}</span>
						</a>
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Final Mark</dt>
					<dd class="mt-0.5 font-semibold text-foreground flex items-center gap-1.5">
						{#if pu.final_mark !== null && pu.final_mark !== undefined}
							{@const isValidated = Boolean(pu['validated?'] ?? pu.validated)}
							<span class="tabular-nums {isValidated ? 'text-emerald-600' : 'text-destructive'}">
								{pu.final_mark}
							</span>
							{#if isValidated}
								<Badge variant="default" class="text-xs px-1.5 py-0 bg-emerald-600">
									Validated
								</Badge>
							{:else}
								<Badge variant="destructive" class="text-xs px-1.5 py-0">
									Failed
								</Badge>
							{/if}
						{:else}
							<span class="text-muted-foreground">In Progress</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Status & Retries</dt>
					<dd class="mt-0.5 capitalize text-foreground">
						{pu.status.replace(/_/g, ' ')}
						{#if pu.occurrence > 0}
							<span class="text-xs text-muted-foreground ml-1">(retry #{pu.occurrence})</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Marked Date</dt>
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
				<div class="border rounded-md p-6 text-center text-muted-foreground text-sm space-y-1">
					<p class="font-medium">No team submissions recorded</p>
					<p class="text-xs">No scale evaluations have been conducted yet.</p>
				</div>
			{:else}
				<div class="space-y-6">
					{#each data.teams as team, idx}
						<div class="space-y-2">
							<!-- Team Header / Minimal Status Row (No wrapper card) -->
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b text-xs">
								<div class="flex items-center gap-2 flex-wrap">
									<UsersIcon class="w-3.5 h-3.5 text-muted-foreground" />
									<span class="font-semibold text-sm text-foreground">
										{team.name}
									</span>
									<span class="text-muted-foreground">
										#{team.id}
									</span>
									{#if team.status}
										<Badge variant="outline" class="text-[10px] capitalize px-1.5 py-0">
											{team.status.replace(/_/g, ' ')}
										</Badge>
									{/if}
								</div>

								<div class="flex items-center gap-3 text-muted-foreground">
									{#if team.final_mark !== null && team.final_mark !== undefined}
										<span class="font-bold text-sm tabular-nums {team['validated?'] ? 'text-emerald-600' : 'text-foreground'}">
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
								<div class="text-xs text-muted-foreground flex items-center gap-2 py-0.5">
									<GitBranchIcon class="w-3 h-3 text-muted-foreground shrink-0" />
									<span class="font-mono text-[11px] truncate select-all">{team.repo_url}</span>
								</div>
							{/if}

							<!-- Team Members (with avatars) -->
							{#if team.users && team.users.length > 0}
								<div class="flex items-center gap-3 flex-wrap py-1.5 text-xs">
									<span class="font-medium text-muted-foreground text-[11px] uppercase tracking-wider">
										Team:
									</span>
									<div class="flex items-center gap-2 flex-wrap">
										{#each team.users as u}
											{@const uProfile = data.userProfiles?.[u.login]}
											{@const memberAvatar = uProfile?.avatar ? getCdnProxyUrl(uProfile.avatar) : null}
											<a
												href={`/users/${u.login}`}
												class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 hover:bg-muted/70 hover:border-primary/40 transition-colors"
											>
												<Avatar.Root class="size-4 shrink-0">
													{#if memberAvatar}
														<Avatar.Image src={memberAvatar} alt={u.login} />
													{/if}
													<Avatar.Fallback class="text-[9px] font-semibold bg-muted uppercase">
														{u.login.slice(0, 2)}
													</Avatar.Fallback>
												</Avatar.Root>
												<span class="font-medium text-foreground">
													{u.login}
												</span>
												{#if u.leader}
													<span class="text-[10px] text-amber-600 font-semibold">(Leader)</span>
												{/if}
											</a>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Scale Teams (Evaluations) -->
							<div class="pt-1">
								{#if !team.scale_teams || team.scale_teams.length === 0}
									<p class="text-xs text-muted-foreground italic py-1">
										No evaluations registered for this attempt.
									</p>
								{:else}
									<div class="divide-y text-sm">
										{#each team.scale_teams as st}
											{@const hasHighMark = typeof st.final_mark === 'number' && st.final_mark >= 100}
											{@const flagName = st.flag?.name || (hasHighMark ? 'Ok' : '')}
											{@const correctorLogin = st.corrector?.login}
											{@const correctorProfile = correctorLogin ? data.userProfiles?.[correctorLogin] : null}
											{@const correctorAvatar = correctorProfile?.avatar ? getCdnProxyUrl(correctorProfile.avatar) : null}
											{@const studentProfile = data.userProfiles?.[data.login]}
											{@const studentAvatar = studentProfile?.avatar ? getCdnProxyUrl(studentProfile.avatar) : null}

											{@const stFeedbacks = Array.isArray((st as any).feedbacks) ? (st as any).feedbacks : []}

											<!-- Flat evaluation message stream without nested card wrapper -->
											<div class="py-3 first:pt-1 space-y-2.5">
												<!-- Header status line -->
												<div class="flex items-center justify-between text-xs text-muted-foreground">
													<div class="flex items-center gap-2">
														{#if flagName}
															<Badge variant={getFlagVariant(st.flag?.name, st.flag?.positive)} class="text-[10px] px-1.5 py-0 font-normal">
																{flagName}
															</Badge>
														{/if}
														<span>{formatDate(st.filled_at || st.begin_at)}</span>
													</div>
													{#if st.final_mark !== null && st.final_mark !== undefined}
														<span class="font-bold text-sm tabular-nums {st.final_mark >= 100 ? 'text-emerald-600' : st.final_mark > 0 ? 'text-amber-600' : 'text-destructive'}">
															{st.final_mark}
														</span>
													{/if}
												</div>

												<!-- Evaluator Message (Chat Message Bubble style) -->
												<div class="flex items-start gap-2.5">
													<Avatar.Root class="size-8 shrink-0 mt-0.5">
														{#if correctorAvatar}
															<Avatar.Image src={correctorAvatar} alt={correctorLogin || 'Evaluator'} />
														{/if}
														<Avatar.Fallback class="text-[11px] font-semibold bg-muted uppercase">
															{correctorLogin ? correctorLogin.slice(0, 2) : 'AU'}
														</Avatar.Fallback>
													</Avatar.Root>

													<div class="flex-1 min-w-0 space-y-1">
														<div class="flex items-center gap-2 text-xs">
															{#if correctorLogin}
																<a href={`/users/${correctorLogin}`} class="font-semibold text-foreground hover:underline">
																	@{correctorLogin}
																</a>
															{:else}
																<span class="font-semibold text-foreground">Moulinette</span>
															{/if}
															<span class="text-[11px] text-muted-foreground">Evaluator</span>
														</div>

														<div class="rounded-lg bg-muted/40 p-3 text-xs text-foreground leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
															{st.comment || 'No written evaluation comment provided.'}
														</div>
													</div>
												</div>

												<!-- Student Feedback Message & Rating (Chat Response style) -->
												{#if st.feedback || stFeedbacks.length > 0}
													{@const fbItem = stFeedbacks[0]}
													{@const ratingValue = fbItem?.rating}
													{@const feedbackComment = st.feedback || fbItem?.comment}
													<div class="flex items-start gap-2.5 pl-6 sm:pl-10">
														<Avatar.Root class="size-7 shrink-0 mt-0.5">
															{#if studentAvatar}
																<Avatar.Image src={studentAvatar} alt={data.login} />
															{/if}
															<Avatar.Fallback class="text-[10px] font-semibold bg-primary/10 text-primary uppercase">
																{data.login.slice(0, 2)}
															</Avatar.Fallback>
														</Avatar.Root>

														<div class="flex-1 min-w-0 space-y-1">
															<div class="flex items-center justify-between gap-2 text-xs">
																<div class="flex items-center gap-1.5">
																	<span class="font-semibold text-foreground">@{data.login}</span>
																	<span class="text-[11px] text-muted-foreground">Student Review</span>
																</div>
																{#if ratingValue !== undefined && ratingValue !== null}
																	<div class="flex items-center gap-1 text-amber-500 font-semibold text-xs">
																		<StarIcon class="w-3.5 h-3.5 fill-current" />
																		<span>{ratingValue} / 5</span>
																	</div>
																{/if}
															</div>

															{#if feedbackComment}
																<div class="rounded-lg bg-primary/5 p-2.5 text-xs text-muted-foreground leading-relaxed border border-primary/10 break-words [overflow-wrap:anywhere]">
																	"{feedbackComment}"
																</div>
															{/if}
														</div>
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
