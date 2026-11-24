<script lang="ts">
	import Footer from '#lib/components/footer.svelte';
	import LoginForm from '#lib/components/login-form.svelte';
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 md:p-6">
	<div class="flex h-full w-full flex-1 items-center justify-center">
		<LoginForm />
	</div>
	<Footer />
</div>
