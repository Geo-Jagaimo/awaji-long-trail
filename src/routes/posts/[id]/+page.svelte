<script lang="ts">
	import type { PageData } from '../$types';
	import SanitizeHtml from '$lib/components/SanitizeHtml.svelte';
	let { data } = $props<{ data: PageData }>();

	const post = data.post;
	const members = post.member || [];
</script>

<svelte:head>
	<title>活動記録</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex flex-col items-center p-6">
	<div class="mx-auto w-full max-w-[1080px] px-3 py-3 lg:px-6 lg:py-6">
		<h1 class="mb-3 text-xl font-bold lg:mb-6 lg:text-4xl">{post.title}</h1>

		{#if post.category.length}
			<div class="text-bold mb-4 space-x-2 text-base text-white lg:mb-8 lg:text-2xl">
				{#each post.category as cat (cat.id)}
					<span class="inline-block rounded bg-orange-500 px-2 py-1">{cat.name}</span>
				{/each}
			</div>
		{/if}

		{#if post.eyecatch}
			<img
				src={post.eyecatch.url}
				alt="eyecatch"
				class="mb-4 h-auto w-full rounded-xl object-cover shadow-md lg:mb-8"
			/>
		{/if}

		{#if members.length}
			<p class="mt-2 mb-4 text-base text-black lg:mt-4 lg:mb-8 lg:text-xl">
				<strong class="text-black">参加メンバー：</strong>
				{#each members as memberItem (memberItem)}
					<span class="mr-2 inline-block rounded bg-orange-300 px-2 py-1">{memberItem}</span>
				{/each}
			</p>
		{/if}

		<div class="prose prose-neutral lg:prose-lg max-w-none">
			<SanitizeHtml html={post.content} />
		</div>
	</div>
</div>
