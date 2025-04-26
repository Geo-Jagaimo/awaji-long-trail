<script lang="ts">
	import type { PageData } from './$types';
	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Awaji Long Trail</title>
	<meta
		name="description"
		content="Awaji Long Trail is a scenic hiking route that showcases the natural beauty of Awaji Island."
	/>
</svelte:head>

<div class="flex flex-col items-center justify-center p-6">
	<h1 class="mb-6 text-3xl font-bold">活動記録</h1>
	<ul class="space-y-2">
		{#each data.contents as content (content.id)}
			<li>
				<a href={`/${content.id}`} class="text-blue-600 hover:underline">
					{content.title}
				</a>
			</li>
		{/each}
	</ul>
</div>
