<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	const { data } = $props();

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatTime(dateString: string): string {
		return new Date(dateString).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hourCycle: 'h23'
		});
	}
</script>

<p>
	{#await data.me}
		Ciao...
	{:then value}
		<Button variant="link" href={`/users/${value.login}`}>Ciao {value.usual_first_name}!</Button>
	{:catch error}
		Ooops: {error}
	{/await}
</p>

<div class="mt-8">
	<h2 class="mb-6 text-2xl font-bold">Events</h2>
	{#await data.events_users}
		<div class="flex items-center justify-center py-12">
			<p class="text-muted-foreground">Loading events...</p>
		</div>
	{:then events_users}
		{#if events_users.length === 0}
			<div class="flex items-center justify-center py-12">
				<p class="text-muted-foreground">No events found</p>
			</div>
		{:else}
			<div class="grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-4">
				{#each events_users as event_user (event_user.id)}
					<div class="rounded-lg border p-6 transition-shadow hover:shadow-md">
						<!-- Event Details -->
						<div class="mb-4">
							<h3 class="mb-2 text-lg font-semibold">{event_user.event.name}</h3>
							{#if event_user.event.description}
								<p class="mb-4 line-clamp-2 text-sm text-muted-foreground">
									{event_user.event.description}
								</p>
							{/if}
						</div>

						<!-- Event Meta Information -->
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p class="text-muted-foreground">Date & Time</p>
								<p class="font-medium">{formatDate(event_user.event.begin_at)}</p>
								<p class="text-xs text-muted-foreground">
									{formatTime(event_user.event.begin_at)} - {formatTime(event_user.event.end_at)}
								</p>
							</div>
							<div>
								<p class="text-muted-foreground">Subscribers</p>
								<p class="font-medium">{event_user.event.nbr_subscribers}</p>
							</div>
						</div>

						{#if event_user.event.location}
							<div class="mt-4 border-t pt-4">
								<p class="mb-1 text-sm text-muted-foreground">Location</p>
								{#if event_user.event.location.startsWith('https')}
									<Button
										href={event_user.event.location}
										target="_blank"
										rel="noopener noreferrer"
										class="p-0"
										variant="link"
										size="sm"
									>
										{event_user.event.location}
									</Button>
								{:else}
									<p class="text-sm break-all">{event_user.event.location}</p>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{:catch error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4">
			<p class="text-red-800">Error loading events: {error}</p>
		</div>
	{/await}
</div>
