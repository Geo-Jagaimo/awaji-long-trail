<script lang="ts">
	import '../app.css';

	const navObject: {
		name: string;
		href: string;
		isExternal?: boolean;
	}[] = [
		{ name: 'Top', href: '/' },
		{ name: '活動記録', href: '/posts' },
		{ name: 'コースマップ', href: '/maps' },
		{ name: '竹原集落', href: 'https://tikusatakehara.com', isExternal: true },
		{ name: 'バンカランカ', href: 'https://bankalanka.com/project/longtrail', isExternal: true }
	];

	let { children } = $props();
</script>

<header class="fixed top-0 left-0 z-50 w-full">
	<div class="mx-auto mt-8 grow rounded-[40px] bg-white px-6 py-3 shadow-md lg:max-w-[1080px]">
		<div class="flex flex-col">
			<div class="flex h-14 items-center justify-between gap-3.5 md:pl-3 lg:gap-5">
				<!-- ページタイトル -->
				<div class="text-2xl font-bold text-black">淡路島ロングトレイル構想</div>
				<!-- ナビゲーションリンク -->
				<nav class="hidden flex-grow justify-end space-x-2.5 md:flex lg:space-x-4">
					{#each navObject as { name, href, isExternal } (href)}
						<a
							{href}
							class="text-black hover:text-orange-500"
							target={isExternal ? '_blank' : undefined}
							rel={isExternal ? 'noopener noreferrer' : undefined}
						>
							{name}
						</a>
					{/each}
				</nav>
			</div>
		</div>
	</div>
</header>

{@render children()}
