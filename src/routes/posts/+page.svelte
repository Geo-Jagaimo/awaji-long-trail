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

<div class="justify-centerp-6 flex flex-col items-center">
	<div class="mx-auto mt-32 mb-6 text-3xl font-bold lg:max-w-[1080px]">活動記録</div>
	<ul class="space-y-2">
		{#each data.contents as content (content.id)}
			<li>
				<a href={`/posts/${content.id}`} class="text-blue-600 hover:underline">
					{content.title}
				</a>
			</li>
		{/each}
	</ul>
</div>
