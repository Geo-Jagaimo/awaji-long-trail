<script lang="ts">
	import type { PageData } from '../$types';
	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>活動記録</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex flex-col items-center justify-center max-w-[1080px] mx-auto px-6 py-6">
	<h1>{data.title}</h1>
	<img src={data.eyecatch?.url} alt="" />
	<div>
		{@html data.content}
	</div>
</div>
