<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Header />

<main class="mt-20">
	{@render children()}
</main>
