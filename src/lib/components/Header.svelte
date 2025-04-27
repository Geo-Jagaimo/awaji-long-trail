<script lang="ts">
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

	let isMenuOpen = $state(false);
	let isShowContactInMenu = $state(false);

	$effect(() => {
		const checkScreen = () => {
			isShowContactInMenu = window.innerWidth < 640;
		};

		checkScreen();

		window.addEventListener('resize', checkScreen);

		return () => {
			window.removeEventListener('resize', checkScreen);
		};
	});
</script>

<header class="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
	<div class="mx-auto flex h-20 max-w-[1080px] items-center justify-between px-6">
		<!-- タイトル -->
		<div class="text-2xl font-bold text-black">淡路島ロングトレイル構想</div>
		<!-- 右側エリア -->
		<div class="ml-auto flex items-center space-x-4">
			<!-- lg以上：ナビリンク＋お問い合わせ -->
			<nav class="hidden items-center space-x-6 lg:flex">
				{#each navObject as { name, href, isExternal } (href)}
					<a
						{href}
						class="text-sm font-medium text-gray-700 hover:text-orange-500"
						target={isExternal ? '_blank' : undefined}
						rel={isExternal ? 'noopener noreferrer' : undefined}
					>
						{name}
					</a>
				{/each}
				<a
					href="https://tikusatakehara.com/contact"
					target="_blank"
					rel="noopener noreferrer"
					class="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
				>
					お問い合わせ
				</a>
			</nav>
			<!-- sm以上lg未満：お問い合わせボタン＋ハンバーガーメニュー -->
			<div class="flex items-center space-x-6 lg:hidden">
				<!-- お問い合わせボタン（sm以上のみボタン表示） -->
				<a
					href="https://tikusatakehara.com/contact"
					target="_blank"
					rel="noopener noreferrer"
					class="hidden rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 sm:inline-flex"
				>
					お問い合わせ
				</a>
				<!-- ハンバーガーメニュー -->
				<button onclick={() => (isMenuOpen = !isMenuOpen)}>
					<svg
						class="h-6 w-6 text-gray-700"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						{#if isMenuOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>
	<!-- ハンバーガーメニュー（lg未満で表示） -->
	{#if isMenuOpen}
		<div class="bg-white shadow-md lg:hidden">
			<div class="flex flex-col items-center pt-4 pb-12">
				<nav class="flex flex-col items-center space-y-4">
					{#each navObject as { name, href, isExternal } (href)}
						<a
							{href}
							class="text-base font-medium text-gray-700 hover:text-orange-500"
							target={isExternal ? '_blank' : undefined}
							rel={isExternal ? 'noopener noreferrer' : undefined}
							onclick={() => (isMenuOpen = false)}
						>
							{name}
						</a>
					{/each}
					{#if isShowContactInMenu}
						<!-- sm未満のときはお問い合わせリンクを追加 -->
						<a
							href="https://tikusatakehara.com/contact"
							target="_blank"
							rel="noopener noreferrer"
							class="text-base font-medium text-gray-700 hover:text-orange-500"
							onclick={() => (isMenuOpen = false)}
						>
							お問い合わせ
						</a>
					{/if}
				</nav>
			</div>
		</div>
	{/if}
</header>
