<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import UsersIcon from '@lucide/svelte/icons/users';
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
	<!-- Top Bar -->
	<div class="flex items-center justify-between border-b pb-4">
		<div class="flex items-center gap-3">
			<a
				href="/events"
				class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border rounded px-2 py-1"
			>
				<ArrowLeftIcon class="w-3 h-3" />
				Back
			</a>

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
	{/if}
</div>
