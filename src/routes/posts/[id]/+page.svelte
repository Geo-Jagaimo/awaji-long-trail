<script lang="ts">
	import type { PageData } from '../$types';
	import SanitizeHtml from '$lib/components/SanitizeHtml.svelte';
	let { data } = $props<{ data: PageData }>();

	const post = data.post;
</script>

<svelte:head>
	<title>活動記録</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex flex-col items-center p-6">
	<div class="mx-auto w-full max-w-[1080px] px-6 py-6">
		<article class="mx-auto max-w-3xl px-4 py-12">
			<h1 class="mb-6 text-4xl font-bold">{post.title}</h1>

			{#if post.eyecatch}
				<img
					src={post.eyecatch.url}
					alt="eyecatch"
					class="mb-8 h-auto w-full rounded-xl object-cover shadow-md"
				/>
			{/if}

			{#if post.category.length}
				<div class="mb-4 space-x-2 text-sm text-gray-500">
					<span class="font-semibold">カテゴリ:</span>
					{#each post.category as cat (cat.id)}
						<span class="inline-block rounded bg-gray-200 px-2 py-1">{cat.name}</span>
					{/each}
				</div>
			{/if}

			{#if post.member}
				<p class="mb-6 text-gray-600">
					<strong class="text-gray-700">参加者:</strong>
					{post.member}
				</p>
			{/if}

			<div class="prose prose-neutral max-w-none">
				<SanitizeHtml html={post.content} />
			</div>
		</article>
	</div>
</div>
