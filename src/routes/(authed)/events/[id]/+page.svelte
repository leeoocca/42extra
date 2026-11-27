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
			class="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
		>
			<ArrowLeftIcon class="h-3.5 w-3.5" />
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
					<Badge variant="outline" class="px-1.5 py-0 text-xs capitalize">
						{ev.kind.replace(/_/g, ' ')}
					</Badge>
				{/if}
			</div>
			<p class="mt-0.5 text-xs text-muted-foreground">
				Event #{data.id}
			</p>
		</div>
	</div>

	{#if data.error}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{data.error}
		</div>
	{:else if ev}
		<!-- Description List: Event Specifications -->
		<div class="space-y-2">
			<h2 class="text-base font-semibold tracking-tight text-foreground">Event Information</h2>
			<dl
				class="grid grid-cols-1 gap-x-6 gap-y-3.5 rounded-md border p-4 text-base sm:grid-cols-2 lg:grid-cols-3"
			>
				<div>
					<dt class="text-sm font-medium text-muted-foreground">Event ID</dt>
					<dd class="mt-0.5 font-semibold text-foreground">#{ev.id}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Event Category</dt>
					<dd class="mt-0.5 text-foreground capitalize">{ev.kind || 'general'}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Location / Room</dt>
					<dd class="mt-0.5 font-medium text-foreground">
						{ev.location || 'Online / Campus'}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Starts At</dt>
					<dd class="mt-0.5 text-foreground">{formatDate(ev.begin_at)}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Ends At</dt>
					<dd class="mt-0.5 text-foreground">{formatDate(ev.end_at)}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Total Duration</dt>
					<dd class="mt-0.5 text-foreground">{calculateDuration(ev.begin_at, ev.end_at)}</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Subscribers</dt>
					<dd class="mt-0.5 text-foreground">
						{ev.nbr_subscribers}{ev.max_people ? ` / ${ev.max_people} maximum` : ' attendees'}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Waitlist Status</dt>
					<dd class="mt-0.5 text-foreground">
						{#if ev.waitlist}
							<span class="font-medium text-amber-600">
								Waitlist active ({ev.waitlist.nbr_users ?? 0} waiting)
							</span>
						{:else}
							<span class="text-muted-foreground">No waitlist</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt class="text-sm font-medium text-muted-foreground">Cancellation Rule</dt>
					<dd class="mt-0.5 text-foreground">
						{ev.prohibition_of_cancellation
							? `${ev.prohibition_of_cancellation}h before start`
							: 'Standard'}
					</dd>
				</div>
			</dl>
		</div>

		<!-- Event Description -->
		{#if ev.description}
			<div class="space-y-2">
				<h2 class="text-base font-semibold tracking-tight text-foreground">Description</h2>
				<div
					class="overflow-x-hidden rounded-md border p-4 text-sm leading-relaxed [overflow-wrap:anywhere] break-words whitespace-pre-line text-foreground"
				>
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
		{#await data.subscribers}
			<div class="space-y-3">
				<h2 class="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
					<UsersIcon class="h-4 w-4 text-muted-foreground" />
					<span>Participants</span>
				</h2>
				<div class="rounded-md border p-6 text-center text-xs text-muted-foreground">
					Loading participants...
				</div>
			</div>
		{:then subscribers}
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h2 class="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
						<UsersIcon class="h-4 w-4 text-muted-foreground" />
						<span>Participants ({subscribers.length})</span>
					</h2>
					{#if ev.max_people}
						<span class="text-xs text-muted-foreground">
							Capacity: {ev.max_people}
						</span>
					{/if}
				</div>

				{#if subscribers.length === 0}
					<div class="rounded-md border p-6 text-center text-xs text-muted-foreground">
						No registered participants yet.
					</div>
				{:else}
					<div class="divide-y rounded-md border text-base">
						{#each subscribers as item}
							{@const u = item.user}
							{@const rawAvatar = u?.image?.link ?? u?.image?.versions?.small}
							{@const avatarUrl = rawAvatar ? getCdnProxyUrl(rawAvatar) : null}
							<div
								class="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-muted/30"
							>
								<div class="flex min-w-0 items-center gap-3">
									{#if avatarUrl}
										<img
											src={avatarUrl}
											alt={u?.login ?? 'User'}
											class="h-8 w-8 shrink-0 rounded-full border bg-muted object-cover"
										/>
									{:else}
										<div
											class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase"
										>
											{u?.login ? u.login.slice(0, 2) : '??'}
										</div>
									{/if}

									<div class="min-w-0">
										<div class="flex items-center gap-2">
											{#if u?.login}
												<a
													href={`/users/${u.login}`}
													class="truncate font-medium text-foreground hover:underline"
												>
													{u.login}
												</a>
											{:else}
												<span class="text-foreground">Student #{item.user_id}</span>
											{/if}

											{#if u?.['staff?']}
												<Badge variant="secondary" class="px-1 py-0 text-xs">Staff</Badge>
											{/if}
										</div>
										{#if u?.usual_full_name || u?.displayname}
											<p class="truncate text-xs text-muted-foreground">
												{u.usual_full_name || u.displayname}
											</p>
										{/if}
									</div>
								</div>

								{#if u?.login}
									<a
										href={`/users/${u.login}`}
										class="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
									>
										<span>Profile</span>
									</a>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/await}

		<!-- Event Feedbacks Section -->
		{#await data.feedbacks then feedbacks}
			{#if feedbacks.length > 0}
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<h2
							class="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
						>
							<MessageSquareIcon class="h-4 w-4 text-muted-foreground" />
							<span>Attendee Feedbacks ({feedbacks.length})</span>
						</h2>
					</div>

					<div class="divide-y rounded-md border text-base">
						{#each feedbacks as fb}
							<div class="space-y-1.5 p-3.5">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2">
										{#if fb.user?.login}
											<a
												href={`/users/${fb.user.login}`}
												class="text-xs font-medium text-foreground hover:underline"
											>
												@{fb.user.login}
											</a>
										{:else}
											<span class="text-xs text-muted-foreground">Attendee</span>
										{/if}
										{#if fb.created_at}
											<span class="text-xs text-muted-foreground">
												{formatDate(fb.created_at)}
											</span>
										{/if}
									</div>

									{#if fb.rating !== undefined && fb.rating !== null}
										<div class="flex items-center gap-1 text-xs font-semibold text-amber-500">
											<StarIcon class="h-3.5 w-3.5 fill-current" />
											<span>{fb.rating}</span>
										</div>
									{/if}
								</div>

								{#if fb.comment}
									<p class="text-xs leading-relaxed whitespace-pre-line text-foreground">
										{fb.comment}
									</p>
								{/if}

								{#if fb.feedback_details && fb.feedback_details.length > 0}
									<div class="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground">
										{#each fb.feedback_details as detail}
											<span class="rounded border bg-muted/20 px-1.5 py-0.5">
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
		{/await}
	{/if}
</div>
