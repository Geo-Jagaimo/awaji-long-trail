<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Awaji Long Trail</title>
	<meta name="description" content="ALTの活動記録です。" />
</svelte:head>

<div class="flex flex-col items-center p-6">
	<div class="mx-auto w-full max-w-[1080px] px-6 py-6">
		<div
			class="text-xl leading-tight font-bold text-amber-800 md:text-4xl lg:text-3xl"
			style="text-spacing-trim: trim-start;"
		>
			活動記録
		</div>
	</div>
	<div class="mt-4 grid w-full max-w-[1080px] grid-cols-1 gap-6 px-6 lg:grid-cols-3">
		{#each data.contents as content (content.id)}
			<a
				href={`/posts/${content.id}`}
				class="block rounded-lg border border-gray-200 bg-white p-6 shadow transition hover:shadow-lg"
			>
				<p class="mb-2 text-sm text-gray-500">
					<small>{new Date(content.publishedAt).toLocaleDateString()}</small>
				</p>
				<h2
					class="text-md font-bold text-amber-800 md:text-lg"
					style="text-spacing-trim: trim-start;"
				>
					{content.title}
				</h2>
			</a>
		{/each}
	</div>
</div>
