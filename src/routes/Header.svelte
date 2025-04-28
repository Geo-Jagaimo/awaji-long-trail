<script lang="ts">
	import OrangeButton from '$lib/components/OrangeButton.svelte';
	import HeaderLink from './HeaderLink.svelte';

	const navObject: {
		name: string;
		href: string;
	}[] = [
		{ name: '活動記録', href: '/posts' },
		{ name: 'コースマップ', href: '/maps' },
		{ name: '竹原集落', href: 'https://tikusatakehara.com' },
		{ name: 'バンカランカ', href: 'https://bankalanka.com/project/longtrail' }
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
		<a href="/" class="text-2xl font-bold text-black">淡路島ロングトレイル構想</a>
		<!-- 右側エリア -->
		<div class="ml-auto flex items-center space-x-4">
			<!-- lg以上：ナビリンク＋お問い合わせ -->
			<nav class="hidden items-center space-x-6 lg:flex">
				{#each navObject as { name, href } (href)}
					<HeaderLink
						{name}
						{href}
						className="text-sm font-medium text-gray-700 hover:text-orange-500"
					/>
				{/each}
				<OrangeButton name="お問い合わせ" href="https://tikusatakehara.com/contact" />
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
			<div class="flex flex-col items-center pb-6">
				<nav class="flex flex-col items-center space-y-4">
					{#each navObject as { name, href } (href)}
						<HeaderLink
							{name}
							{href}
							className="text-sm font-medium text-gray-700 hover:text-orange-500"
							onClick={() => (isMenuOpen = false)}
						/>
					{/each}
					{#if isShowContactInMenu}
						<!-- sm未満のときはお問い合わせリンクを追加 -->
						<HeaderLink
							name="お問い合わせ"
							href="https://tikusatakehara.com/contact"
							className="text-base font-medium text-gray-700 hover:text-orange-500"
							onClick={() => (isMenuOpen = false)}
						/>
					{/if}
				</nav>
			</div>
		</div>
	{/if}
</header>
