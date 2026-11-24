<script lang="ts">
	import { Input } from '#lib/components/ui/input/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import ListIcon from '@lucide/svelte/icons/list';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import UsersIcon from '@lucide/svelte/icons/users';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import type { FtEvent } from '#lib/schemas/42.js';

	let { data }: { data: PageData } = $props();

	// Read initial state from URL search params
	const urlView = page.url.searchParams.get('view');
	const initialLayout = urlView === 'list' || urlView === 'week' ? urlView : 'week';
	const urlFilter = page.url.searchParams.get('filter');
	const initialFilter =
		urlFilter === 'past' || urlFilter === 'all' || urlFilter === 'upcoming'
			? urlFilter
			: 'upcoming';
	const urlWeek = Number(page.url.searchParams.get('week'));
	const initialWeek = !isNaN(urlWeek) && urlWeek !== 0 ? urlWeek : 0;

	let searchQuery = $state('');
	let viewFilter = $state<'all' | 'upcoming' | 'past'>(initialFilter);
	let layoutMode = $state<'list' | 'week'>(initialLayout);

	// Week navigation state (offset in weeks from current week)
	let weekOffset = $state(initialWeek);

	function updateUrlParams() {
		const url = new URL(page.url.href);
		let changed = false;

		// view (layout)
		if (layoutMode === 'list') {
			if (url.searchParams.get('view') !== 'list') {
				url.searchParams.set('view', 'list');
				changed = true;
			}
		} else {
			if (url.searchParams.has('view')) {
				url.searchParams.delete('view');
				changed = true;
			}
		}

		// filter
		if (viewFilter !== 'upcoming') {
			if (url.searchParams.get('filter') !== viewFilter) {
				url.searchParams.set('filter', viewFilter);
				changed = true;
			}
		} else {
			if (url.searchParams.has('filter')) {
				url.searchParams.delete('filter');
				changed = true;
			}
		}

		// week offset
		if (layoutMode === 'week' && weekOffset !== 0) {
			const str = String(weekOffset);
			if (url.searchParams.get('week') !== str) {
				url.searchParams.set('week', str);
				changed = true;
			}
		} else {
			if (url.searchParams.has('week')) {
				url.searchParams.delete('week');
				changed = true;
			}
		}

		if (changed) {
			goto(url.href, { replaceState: true, noScroll: true, keepFocus: true } as any);
		}
	}

	$effect(() => {
		// Sync when layoutMode, viewFilter, or weekOffset change
		updateUrlParams();
	});

	let campusName = $derived(data.primaryCampus?.name ?? `Campus #${data.primaryCampusId}`);

	function isFutureEvent(endAt: string) {
		return new Date(endAt).getTime() >= Date.now();
	}

	let filteredEvents = $derived.by(() => {
		const list = data.events ?? [];
		const q = searchQuery.trim().toLowerCase();

		let events = list.filter((event) => {
			if (viewFilter === 'upcoming' && !isFutureEvent(event.end_at)) return false;
			if (viewFilter === 'past' && isFutureEvent(event.end_at)) return false;

			if (!q) return true;
			const nameMatch = event.name?.toLowerCase().includes(q);
			const locMatch = event.location?.toLowerCase().includes(q);
			const kindMatch = event.kind?.toLowerCase().includes(q);
			return nameMatch || locMatch || kindMatch;
		});

		return events.sort((a, b) => {
			if (viewFilter === 'upcoming') {
				// Chronologically ascending: earliest start date first
				return new Date(a.begin_at).getTime() - new Date(b.begin_at).getTime();
			} else if (viewFilter === 'past') {
				// Most recent past first
				return new Date(b.begin_at).getTime() - new Date(a.begin_at).getTime();
			} else {
				// For 'all': upcoming first (ascending), then past (descending)
				const aFuture = isFutureEvent(a.end_at);
				const bFuture = isFutureEvent(b.end_at);
				if (aFuture && !bFuture) return -1;
				if (!aFuture && bFuture) return 1;
				if (aFuture && bFuture) {
					return new Date(a.begin_at).getTime() - new Date(b.begin_at).getTime();
				}
				return new Date(b.begin_at).getTime() - new Date(a.begin_at).getTime();
			}
		});
	});

	let upcomingCount = $derived(data.events?.filter((e) => isFutureEvent(e.end_at)).length ?? 0);
	let pastCount = $derived(data.events?.filter((e) => !isFutureEvent(e.end_at)).length ?? 0);

	function formatEventDates(beginAt: string, endAt: string) {
		const b = new Date(beginAt);
		const e = new Date(endAt);
		const dateStr = b.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
		const bTime = b.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		const eTime = e.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		return `${dateStr}, ${bTime} - ${eTime}`;
	}

	function formatTimeOnly(dateIso: string) {
		const d = new Date(dateIso);
		return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	}

	function isSameDay(d1: Date, d2: Date) {
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	}

	function isMultiDayEvent(beginAt: string, endAt: string) {
		const b = new Date(beginAt);
		const e = new Date(endAt);
		return !isSameDay(b, e);
	}

	function shouldShowTimeOnDay(beginAt: string, endAt: string, currentDayDate: Date) {
		const b = new Date(beginAt);
		const isFirstDay = isSameDay(b, currentDayDate);
		// If multi-day event: only show time on first day
		if (isMultiDayEvent(beginAt, endAt)) {
			return isFirstDay;
		}
		// Single day event: always show time
		return true;
	}

	function getKindVariant(kind: string): 'default' | 'secondary' | 'outline' {
		switch (kind) {
			case 'workshop':
			case 'hackathon':
				return 'default';
			case 'meet_up':
			case 'conference':
				return 'secondary';
			default:
				return 'outline';
		}
	}

	// Week calculation logic
	let currentWeekDays = $derived.by(() => {
		const now = new Date();
		// Compute start of week (Monday)
		const day = now.getDay();
		const diffToMonday = day === 0 ? -6 : 1 - day; // Monday is day 1, Sunday is 0
		const monday = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + diffToMonday + weekOffset * 7
		);
		monday.setHours(0, 0, 0, 0);

		const days = [];
		for (let i = 0; i < 7; i++) {
			const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
			const isToday =
				d.getDate() === now.getDate() &&
				d.getMonth() === now.getMonth() &&
				d.getFullYear() === now.getFullYear();

			// Filter events occurring on this day
			const dayStart = new Date(d).getTime();
			const dayEnd = dayStart + 24 * 60 * 60 * 1000;

			const dayEvents = filteredEvents
				.filter((ev) => {
					const evBegin = new Date(ev.begin_at).getTime();
					const evEnd = new Date(ev.end_at).getTime();
					// Overlaps with day
					return evBegin < dayEnd && evEnd > dayStart;
				})
				.sort((a, b) => new Date(a.begin_at).getTime() - new Date(b.begin_at).getTime());

			days.push({
				date: d,
				dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
				dayNum: d.getDate(),
				monthName: d.toLocaleDateString(undefined, { month: 'short' }),
				isToday,
				events: dayEvents
			});
		}
		return days;
	});

	let weekRangeLabel = $derived.by(() => {
		if (currentWeekDays.length === 0) return '';
		const first = currentWeekDays[0].date;
		const last = currentWeekDays[6].date;
		const firstStr = first.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
		const lastStr = last.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
		return `${firstStr} – ${lastStr}`;
	});
</script>

<div class="space-y-6">
	<div class="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Campus Events</h1>
				<Badge variant="outline" class="text-xs">
					{campusName}
				</Badge>
			</div>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<!-- Layout toggle (List vs Week) -->
			<div class="inline-flex gap-0.5 rounded-lg border bg-muted/40 p-0.5">
				<Button
					variant={layoutMode === 'list' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (layoutMode = 'list')}
					class="gap-1.5"
					title="List view"
				>
					<ListIcon class="size-3.5" />
					<span>List</span>
				</Button>
				<Button
					variant={layoutMode === 'week' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (layoutMode = 'week')}
					class="gap-1.5"
					title="Week calendar view"
				>
					<CalendarIcon class="size-3.5" />
					<span>Week</span>
				</Button>
			</div>

			<!-- Status filter toggle -->
			<div class="inline-flex gap-0.5 rounded-lg border bg-muted/40 p-0.5">
				<Button
					variant={viewFilter === 'upcoming' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (viewFilter = 'upcoming')}
				>
					Upcoming ({upcomingCount})
				</Button>
				<Button
					variant={viewFilter === 'past' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (viewFilter = 'past')}
				>
					Past ({pastCount})
				</Button>
				<Button
					variant={viewFilter === 'all' ? 'secondary' : 'ghost'}
					size="xs"
					onclick={() => (viewFilter = 'all')}
				>
					All ({data.events?.length ?? 0})
				</Button>
			</div>
		</div>
	</div>

	<!-- Controls Bar: Search & Week Navigation -->
	<div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
		<div class="relative w-full sm:w-64">
			<SearchIcon class="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Filter events..."
				bind:value={searchQuery}
				class="h-8 pl-8 text-xs"
			/>
		</div>

		{#if layoutMode === 'week'}
			<div class="flex items-center gap-2 self-start sm:self-center">
				<Button
					variant="outline"
					size="icon-sm"
					onclick={() => (weekOffset -= 1)}
					class="size-8"
					title="Previous week"
					aria-label="Previous week"
				>
					<ChevronLeftIcon class="h-4 w-4" />
				</Button>

				<Button
					variant={weekOffset === 0 ? 'secondary' : 'outline'}
					size="sm"
					onclick={() => (weekOffset = 0)}
					class="h-8 px-2.5 text-xs font-medium"
				>
					Today
				</Button>

				<Button
					variant="outline"
					size="icon-sm"
					onclick={() => (weekOffset += 1)}
					class="size-8"
					title="Next week"
					aria-label="Next week"
				>
					<ChevronRightIcon class="h-4 w-4" />
				</Button>

				<span class="ml-1 text-xs font-medium text-foreground">
					{weekRangeLabel}
				</span>
			</div>
		{/if}
	</div>

	{#if data.error}
		<div
			class="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
		>
			{data.error}
		</div>
	{/if}

	{#if filteredEvents.length === 0}
		<div class="space-y-1 rounded-md border p-6 text-center text-sm text-muted-foreground">
			<p class="font-medium">No events found</p>
			<p class="text-xs">
				{searchQuery
					? 'No event matches your filter.'
					: `No ${viewFilter} events scheduled for ${campusName}.`}
			</p>
		</div>
	{:else if layoutMode === 'list'}
		<!-- Standard Minimal List Layout -->
		<div class="divide-y rounded-md border text-base">
			{#each filteredEvents as event}
				<div class="space-y-1.5 p-3.5 transition-colors hover:bg-muted/30">
					<div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
						<div class="flex min-w-0 flex-wrap items-center gap-2">
							<a
								href={`/events/${event.id}`}
								class="truncate text-base font-semibold text-foreground hover:underline"
							>
								{event.name}
							</a>
							<Badge variant={getKindVariant(event.kind)} class="px-2 py-0.5 text-xs capitalize">
								{event.kind.replace(/_/g, ' ')}
							</Badge>
						</div>
					</div>

					<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
						<span class="flex items-center gap-1 text-foreground">
							<ClockIcon class="h-3.5 w-3.5 text-muted-foreground" />
							{formatEventDates(event.begin_at, event.end_at)}
						</span>

						{#if event.location}
							<span class="flex items-center gap-1">
								<MapPinIcon class="h-3 w-3" />
								{event.location}
							</span>
						{/if}

						<span class="flex items-center gap-1">
							<UsersIcon class="h-3 w-3" />
							{event.nbr_subscribers}{event.max_people ? ` / ${event.max_people}` : ''} subscribers
						</span>
					</div>

					{#if event.description}
						<p
							class="line-clamp-2 pt-0.5 text-xs [overflow-wrap:anywhere] break-words text-muted-foreground/90"
						>
							{event.description}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- Week Layout (7 Columns, Mon-Sun) filling vertical space -->
		<div
			class="grid min-h-[calc(100vh-16rem)] grid-cols-1 divide-y overflow-hidden rounded-md border md:grid-cols-7 md:divide-x md:divide-y-0"
		>
			{#each currentWeekDays as day}
				<div class="flex h-full flex-col {day.isToday ? 'bg-primary/5' : 'bg-background'}">
					<!-- Day Column Header -->
					<div
						class="flex items-center justify-between gap-1 border-b p-2.5 md:flex-col md:items-start {day.isToday
							? 'border-b-primary/30 font-semibold'
							: ''}"
					>
						<div class="flex items-baseline gap-1.5">
							<span class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
								{day.dayName}
							</span>
							<span class="text-sm font-bold {day.isToday ? 'text-primary' : 'text-foreground'}">
								{day.dayNum}
							</span>
						</div>
						<span class="text-xs text-muted-foreground">
							{day.monthName}
						</span>
					</div>

					<!-- Day Events Container -->
					<div class="flex-1 space-y-2 p-2">
						{#if day.events.length === 0}
							<div
								class="flex h-full items-center justify-center p-3 text-center text-xs text-muted-foreground/50"
							>
								No events
							</div>
						{:else}
							{#each day.events as event}
								{@const showTime = shouldShowTimeOnDay(event.begin_at, event.end_at, day.date)}
								<a
									href={`/events/${event.id}`}
									class="block space-y-1 rounded-md border bg-card p-2 shadow-2xs transition-colors hover:border-primary/50 hover:bg-muted/40"
								>
									<div class="flex items-center justify-between gap-1">
										<Badge
											variant={getKindVariant(event.kind)}
											class="px-1.5 py-0 text-xs capitalize"
										>
											{event.kind.replace(/_/g, ' ')}
										</Badge>
										{#if showTime}
											<span class="text-xs font-medium text-muted-foreground">
												{formatTimeOnly(event.begin_at)}
											</span>
										{/if}
									</div>
									<div class="line-clamp-2 text-xs leading-snug font-semibold text-foreground">
										{event.name}
									</div>
									{#if event.location}
										<div class="flex items-center gap-1 truncate text-xs text-muted-foreground">
											<MapPinIcon class="h-2.5 w-2.5 shrink-0" />
											<span class="truncate">{event.location}</span>
										</div>
									{/if}
								</a>
							{/each}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
