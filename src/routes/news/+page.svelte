<script lang="ts">
	import '../../app.css';
	import SanitizeHtml from '$lib/components/SanitizeHtml.svelte'; // Import SanitizeHtml component

	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<div class="flex flex-col items-center p-6">
	<div class="mx-auto w-full max-w-[1080px] px-6 py-6">
		<div
			class="text-2xl leading-tight font-bold text-amber-800 md:text-4xl lg:text-3xl"
			style="text-spacing-trim: trim-start;"
		>
			お知らせ
		</div>
		<div class="mt-2 overflow-y-auto px-4 pt-4">
			{#if data.newsList.length === 0}
				<p class="text-base">お知らせはまだありません。</p>
			{:else}
				<ul class="space-y-4">
					{#each data.newsList as news (news.id)}
						<li>
							<h2 class="text-xl font-semibold">{news.title}</h2>
							<p class="text-sm text-black">
								<small>{new Date(news.publishedAt).toLocaleDateString()}</small>
							</p>
							<div class="news-content mb-2 px-2 text-base">
								<SanitizeHtml html={news.content} />
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>
