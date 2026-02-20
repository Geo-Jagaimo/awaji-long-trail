<script lang="ts">
	import type { PageData } from './$types';
	import MoreButton from '$lib/components/MoreButton.svelte';
	import SanitizeHtml from '$lib/components/SanitizeHtml.svelte'; // Import SanitizeHtml component

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Awaji Long Trail</title>
	<meta
		name="description"
		content="淡路島ロングトレイル構想は、木炭の産地だった竹原集落に残る山林道をトレイルコースとして整備し、地域の魅力を伝える取り組みです。"
	/>
</svelte:head>

<div class="relative w-full overflow-hidden">
	<!-- image -->
	<img src="/image_top.png" alt="Top Page" class="h-[600px] w-full object-cover" />
	<!-- contents -->
	<div class="absolute top-0 left-0 flex h-[600px] w-full items-center justify-center">
		<div class="flex w-full max-w-[1080px] flex-col px-6">
			<div
				class="text-2xl leading-tight font-bold text-amber-800 md:text-4xl lg:text-5xl"
				style="text-spacing-trim: trim-start;"
			>
				「歩くアワイチ」を目指して
			</div>
			<div
				class="text-md mt-8 font-bold text-amber-800 md:text-lg"
				style="text-spacing-trim: trim-start;"
			>
				かつて、木炭の産地だった竹原。<br />
				集落の四方を囲む山林には、立派な炭窯跡と、それらを繋ぐ山林道のネットワークが残っています。<br
				/>
				「淡路島ロングトレイル構想」は、そんな山林に少しだけ手を加えてトレイルコースとして整備し、竹原の魅力を味わってもらう取り組みです。<br
				/>
				淡路島全土を歩いて繋ぐ「歩くアワイチ」を目指して、ゆっくりと活動を進めています。
			</div>
		</div>
	</div>
</div>
<div class="relative w-full overflow-hidden bg-orange-100">
	<div class="mx-auto w-full max-w-[1080px] px-6 py-6 lg:py-12">
		<div
			class="text-xl leading-tight font-bold text-amber-800 md:text-4xl lg:text-3xl"
			style="text-spacing-trim: trim-start;"
		>
			お知らせ
		</div>
		<div class="pl:px-4 mt-2 overflow-y-auto px-0.5">
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
		<div class="mx-auto mt-8 flex flex-col items-center gap-4">
			<MoreButton href="/news" />
		</div>
	</div>
</div>
