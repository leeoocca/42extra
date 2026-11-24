<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { getCdnProxyUrl } from '#lib/cdn.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import UsersIcon from '@lucide/svelte/icons/users';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';
	import StarIcon from '@lucide/svelte/icons/star';
	import UserIcon from '@lucide/svelte/icons/user';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let ev = $derived(data.event);
	let subscribers = $derived(data.subscribers ?? []);
	let feedbacks = $derived(data.feedbacks ?? []);

	function formatDate(isoDate?: string | null) {
		if (!isoDate) return 'N/A';
		const d = new Date(isoDate);
		return d.toLocaleDateString(undefined, {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function calculateDuration(beginAt?: string, endAt?: string) {
		if (!beginAt || !endAt) return 'N/A';
		const ms = new Date(endAt).getTime() - new Date(beginAt).getTime();
		const hours = Math.floor(ms / (1000 * 60 * 60));
		const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
		if (hours === 0) return `${mins}m`;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	}
</script>

<div class="space-y-6">
	<!-- Back button above title -->
	<div>
		<Button
			variant="ghost"
			size="sm"
			href="/events"
			class="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
		>
			<ArrowLeftIcon class="w-3.5 h-3.5" />
			<span>Back to Events</span>
		</Button>
	</div>

	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b pb-4">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
					{ev?.name || `Event #${data.id}`}
				</h1>
				{#if ev?.kind}
					<Badge variant="outline" class="text-[10px] capitalize px-1.5 py-0">
						{ev.kind.replace(/_/g, ' ')}
					</Badge>
				{/if}
			</div>
			<p class="text-xs text-muted-foreground mt-0.5">
				Event #{data.id}
			</p>
		</div>
	</div>

	{#if data.error}
		<div class="border border-destructive/20 bg-destructive/10 text-destructive rounded-md p-3 text-xs">
			{data.error}
		</div>
	{:else if ev}
		<!-- Description List: Event Specifications -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Event Information</h2>
			<dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3.5 border rounded-md p-4 text-sm">
				<div>
					<dt class="text-xs text-muted-foreground font-medium">Event ID</dt>
					<dd class="font-semibold text-foreground mt-0.5">#{ev.id}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Event Category</dt>
					<dd class="text-foreground mt-0.5 capitalize">{ev.kind || 'general'}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Location / Room</dt>
					<dd class="text-foreground mt-0.5 font-medium">
						{ev.location || 'Online / Campus'}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Starts At</dt>
					<dd class="text-foreground mt-0.5">{formatDate(ev.begin_at)}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Ends At</dt>
					<dd class="text-foreground mt-0.5">{formatDate(ev.end_at)}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Total Duration</dt>
					<dd class="text-foreground mt-0.5">{calculateDuration(ev.begin_at, ev.end_at)}</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Subscribers</dt>
					<dd class="text-foreground mt-0.5">
						{ev.nbr_subscribers}{ev.max_people ? ` / ${ev.max_people} maximum` : ' attendees'}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Waitlist Status</dt>
					<dd class="text-foreground mt-0.5">
						{#if ev.waitlist}
							<span class="text-amber-600 font-medium">Waitlist active ({ev.waitlist.nbr_users ?? 0} waiting)</span>
						{:else}
							<span class="text-muted-foreground">No waitlist</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-xs text-muted-foreground font-medium">Cancellation Rule</dt>
					<dd class="text-foreground mt-0.5">
						{ev.prohibition_of_cancellation ? `${ev.prohibition_of_cancellation}h before start` : 'Standard'}
					</dd>
				</div>
			</dl>
		</div>

		<!-- Event Description -->
		{#if ev.description}
			<div class="space-y-2">
				<h2 class="text-base font-semibold tracking-tight text-foreground">Description</h2>
				<div class="border rounded-md p-4 text-sm leading-relaxed text-foreground whitespace-pre-line break-words [overflow-wrap:anywhere] overflow-x-hidden">
					{ev.description}
				</div>
			</div>
		{/if}

		<!-- Event Themes -->
		{#if ev.themes && ev.themes.length > 0}
			<div class="space-y-2">
				<h2 class="text-sm font-semibold tracking-tight text-foreground">Themes & Topics</h2>
				<div class="flex flex-wrap gap-1.5">
					{#each ev.themes as theme}
						<Badge variant="secondary" class="text-xs">
							{theme.name || theme}
						</Badge>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Event Participants List (Flat minimal container without nested cards) -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<h2 class="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
					<UsersIcon class="w-4 h-4 text-muted-foreground" />
					<span>Participants ({subscribers.length})</span>
				</h2>
				{#if ev.max_people}
					<span class="text-xs text-muted-foreground">
						Capacity: {ev.max_people}
					</span>
				{/if}
			</div>

			{#if subscribers.length === 0}
				<div class="border rounded-md p-6 text-center text-muted-foreground text-xs">
					No registered participants yet.
				</div>
			{:else}
				<div class="border rounded-md divide-y text-sm">
					{#each subscribers as item}
						{@const u = item.user}
						{@const rawAvatar = u?.image?.link ?? u?.image?.versions?.small}
						{@const avatarUrl = rawAvatar ? getCdnProxyUrl(rawAvatar) : null}
						<div class="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors gap-3">
							<div class="flex items-center gap-3 min-w-0">
								{#if avatarUrl}
									<img
										src={avatarUrl}
										alt={u?.login ?? 'User'}
										class="w-8 h-8 rounded-full object-cover border bg-muted shrink-0"
									/>
								{:else}
									<div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold uppercase shrink-0">
										{u?.login ? u.login.slice(0, 2) : '??'}
									</div>
								{/if}

								<div class="min-w-0">
									<div class="flex items-center gap-2">
										{#if u?.login}
											<a
												href={`/users/${u.login}`}
												class="font-medium text-foreground hover:underline truncate"
											>
												{u.login}
											</a>
										{:else}
											<span class="text-foreground">Student #{item.user_id}</span>
										{/if}

										{#if u?.['staff?']}
											<Badge variant="secondary" class="text-[10px] px-1 py-0">Staff</Badge>
										{/if}
									</div>
									{#if u?.usual_full_name || u?.displayname}
										<p class="text-xs text-muted-foreground truncate">
											{u.usual_full_name || u.displayname}
										</p>
									{/if}
								</div>
							</div>

							{#if u?.login}
								<a
									href={`/users/${u.login}`}
									class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border rounded px-2 py-1"
								>
									<span>Profile</span>
								</a>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Event Feedbacks Section -->
		{#if feedbacks.length > 0}
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h2 class="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
						<MessageSquareIcon class="w-4 h-4 text-muted-foreground" />
						<span>Attendee Feedbacks ({feedbacks.length})</span>
					</h2>
				</div>

				<div class="border rounded-md divide-y text-sm">
					{#each feedbacks as fb}
						<div class="p-3.5 space-y-1.5">
							<div class="flex items-center justify-between gap-2">
								<div class="flex items-center gap-2">
									{#if fb.user?.login}
										<a href={`/users/${fb.user.login}`} class="font-medium text-xs text-foreground hover:underline">
											@{fb.user.login}
										</a>
									{:else}
										<span class="text-xs text-muted-foreground">Attendee</span>
									{/if}
									{#if fb.created_at}
										<span class="text-[11px] text-muted-foreground">
											{formatDate(fb.created_at)}
										</span>
									{/if}
								</div>

								{#if fb.rating !== undefined && fb.rating !== null}
									<div class="flex items-center gap-1 text-amber-500 font-semibold text-xs">
										<StarIcon class="w-3.5 h-3.5 fill-current" />
										<span>{fb.rating}</span>
									</div>
								{/if}
							</div>

							{#if fb.comment}
								<p class="text-xs text-foreground leading-relaxed whitespace-pre-line">
									{fb.comment}
								</p>
							{/if}

							{#if fb.feedback_details && fb.feedback_details.length > 0}
								<div class="flex flex-wrap gap-2 pt-1 text-[11px] text-muted-foreground">
									{#each fb.feedback_details as detail}
										<span class="border rounded px-1.5 py-0.5 bg-muted/20">
											{detail.kind}: <strong>{detail.rate}</strong>
										</span>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
