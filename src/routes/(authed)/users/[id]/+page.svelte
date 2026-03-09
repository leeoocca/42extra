<script lang="ts">
	const { data } = $props();
</script>

<p>
	{#await data.user}
		Loading...
	{:then user}
		{user.usual_first_name}
	{:catch error}
		Ooops: {error}
	{/await}
</p>
