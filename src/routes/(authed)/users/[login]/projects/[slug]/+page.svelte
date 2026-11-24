<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
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
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
		<div class="flex items-center gap-3">
			<a
				href={`/users/${data.login}`}
				class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border rounded px-2.5 py-1.5 transition-colors"
			>
				<ArrowLeftIcon class="w-3.5 h-3.5" />
				Back to @{data.login}
			</a>

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
				<p class="text-xs text-muted-foreground mt-0.5">
					User project evaluations, scale teams, and submission records.
				</p>
			</div>
		</div>

		<div class="flex items-center gap-2 flex-wrap">
			<a
				href={`/projects/${data.slug}`}
				class="text-xs border rounded px-2.5 py-1.5 text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1.5"
			>
				Project Spec &rarr;
			</a>
			<a
				href={`https://projects.intra.42.fr/projects/${data.slug}`}
				target="_blank"
				rel="noreferrer"
				class="text-xs border rounded px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
			>
				Intra <ExternalLinkIcon class="w-3 h-3" />
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
							<span class={isValidated ? 'text-emerald-600' : 'text-destructive'}>
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
			<div class="flex items-center justify-between">
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
				<div class="space-y-4">
					{#each data.teams as team, idx}
						<div class="border rounded-md overflow-hidden bg-card">
							<!-- Team Banner -->
							<div class="border-b p-3 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
								<div class="flex items-center gap-2 flex-wrap">
									<UsersIcon class="w-4 h-4 text-muted-foreground" />
									<span class="font-semibold text-sm text-foreground">
										{team.name}
									</span>
									<span class="text-xs text-muted-foreground">
										(Team #{team.id})
									</span>
									{#if team.status}
										<Badge variant="outline" class="text-xs capitalize px-1.5 py-0">
											{team.status.replace(/_/g, ' ')}
										</Badge>
									{/if}
								</div>

								<div class="flex items-center gap-3 text-xs text-muted-foreground">
									{#if team.final_mark !== null && team.final_mark !== undefined}
										<span class="font-semibold text-sm {team['validated?'] ? 'text-emerald-600' : 'text-foreground'}">
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
								<div class="px-3 py-2 border-b bg-muted/10 text-xs text-muted-foreground flex items-center gap-2">
									<GitBranchIcon class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
									<span class="font-mono text-[11px] truncate select-all">{team.repo_url}</span>
								</div>
							{/if}

							<!-- Team Users if multiple members -->
							{#if team.users && team.users.length > 1}
								<div class="p-3 border-b text-xs space-y-1">
									<span class="text-muted-foreground font-medium">Teammates:</span>
									<div class="flex items-center gap-2 flex-wrap pt-0.5">
										{#each team.users as u}
											<a
												href={`/users/${u.login}`}
												class="inline-flex items-center gap-1 border rounded px-1.5 py-0.5 font-mono hover:bg-muted transition-colors"
											>
												@{u.login}
												{#if u.leader}
													<span class="text-[10px] text-amber-600 font-sans font-medium">(Leader)</span>
												{/if}
											</a>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Scale Teams (Evaluations) -->
							<div class="p-3 space-y-3">
								<h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
									<ShieldCheckIcon class="w-3.5 h-3.5" />
									Peer & Automated Evaluations ({team.scale_teams?.length ?? 0})
								</h3>

								{#if !team.scale_teams || team.scale_teams.length === 0}
									<p class="text-xs text-muted-foreground italic py-2">
										No evaluations registered for this attempt.
									</p>
								{:else}
									<div class="space-y-3">
										{#each team.scale_teams as st}
											{@const hasHighMark = typeof st.final_mark === 'number' && st.final_mark >= 100}
											{@const flagName = st.flag?.name || (hasHighMark ? 'Ok' : '')}
											<div class="border rounded-md p-3.5 space-y-2.5 bg-background">
												<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
													<div class="flex items-center gap-2 flex-wrap">
														{#if st.corrector}
															<a
																href={`/users/${st.corrector.login}`}
																class="font-semibold text-xs text-foreground hover:underline inline-flex items-center gap-1"
															>
																<UserIcon class="w-3.5 h-3.5 text-muted-foreground" />
																<span class="font-mono">@{st.corrector.login}</span>
															</a>
														{:else}
															<span class="font-semibold text-xs text-foreground flex items-center gap-1">
																<ShieldCheckIcon class="w-3.5 h-3.5 text-muted-foreground" />
																Moulinette / Automated
															</span>
														{/if}

														{#if flagName}
															<Badge variant={getFlagVariant(st.flag?.name, st.flag?.positive)} class="text-xs px-1.5 py-0">
																{flagName}
															</Badge>
														{/if}

														<span class="text-xs text-muted-foreground">
															evaluated {formatDate(st.filled_at || st.begin_at)}
														</span>
													</div>

													<div class="text-right shrink-0">
														{#if st.final_mark !== null && st.final_mark !== undefined}
															<span class="font-bold text-sm {st.final_mark >= 100 ? 'text-emerald-600' : st.final_mark > 0 ? 'text-amber-600' : 'text-destructive'}">
																{st.final_mark}
															</span>
														{/if}
													</div>
												</div>

												<!-- Evaluator Comment -->
												{#if st.comment}
													<div class="space-y-1">
														<span class="text-xs font-medium text-muted-foreground">
															Evaluator Feedback:
														</span>
														<div class="p-2.5 rounded bg-muted/30 text-xs text-foreground leading-relaxed whitespace-pre-line border border-muted/50">
															{st.comment}
														</div>
													</div>
												{/if}

												<!-- Student Feedback -->
												{#if st.feedback}
													<div class="space-y-1">
														<span class="text-xs font-medium text-muted-foreground flex items-center gap-1">
															<MessageSquareIcon class="w-3 h-3" />
															Student Feedback:
														</span>
														<div class="p-2 rounded bg-muted/15 text-xs text-muted-foreground italic leading-relaxed border border-dashed">
															"{st.feedback}"
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
