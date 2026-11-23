<script lang="ts">
	import { page } from '$app/state';

	const { data } = page;
</script>

<div class="space-y-4">
	<div>
		<h1 class="text-2xl font-bold tracking-tight md:text-3xl">My Profile</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Your student profile, logs, and account settings.
		</p>
	</div>

	<div class="overflow-scroll rounded-xl border border-dashed border-border bg-card/50 p-8">
		<pre class="font-mono">{JSON.stringify(data, null, 2)}</pre>
	</div>
</div>
