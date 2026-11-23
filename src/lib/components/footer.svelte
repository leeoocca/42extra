<script lang="ts">
	interface Props {
		intraLink?: string;
	}

	let { intraLink }: Props = $props();
</script>

<footer class="w-full my-6 text-sm font-light text-center text-muted-foreground">
	{#if intraLink}
		<a
			href={intraLink}
			target="_blank"
			rel="noopener noreferrer"
			class="text-xs hover:underline text-muted-foreground/80 block mb-1"
		>
			This page on the Intra
		</a>
	{/if}
	<p>
		<a
			href="https://github.com/leeoocca/42extra"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium text-foreground hover:underline"
		>
			42extra
		</a>
		<span> — a project by </span>
		<a
			href="https://profile.intra.42.fr/users/lrocca"
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium text-foreground hover:underline"
		>
			lrocca
		</a>
	</p>
</footer>
