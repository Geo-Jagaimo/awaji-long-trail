<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<Header />

<main class="mt-32">
	{@render children()}
</main>