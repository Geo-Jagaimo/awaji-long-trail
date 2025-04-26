<script lang="ts">
	import type { PageData } from './$types';
	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>ブログ</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex flex-col items-center justify-center">
	<h1>{data.title}</h1>
	<img src={data.eyecatch?.url} alt="" />
	<div>
		<!-- svelte-ignore svelte/no-at-html-tags -->
		{@html data.content}
	</div>
</div>
