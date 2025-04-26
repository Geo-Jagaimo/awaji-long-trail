<script lang="ts">
	import '../app.css';

	const navObject: {
		name: string;
		href: string;
	}[] = [
		{ name: 'Top', href: '/' },
		{ name: '活動記録', href: '/posts' },
		{ name: '竹原集落について', href: 'https://tikusatakehara.com' }
	];

	let { children } = $props();
</script>

<header>
	<div class="grow rounded-[40px] bg-white px-6 py-3 shadow-md lg:max-w-[1080px]">
		<div class="flex flex-col">
			<div class="flex h-14 items-center justify-between gap-3.5 md:pl-3 lg:gap-5">
				<!-- ナビゲーションリンク -->
				<nav class="hidden flex-grow justify-end space-x-2.5 md:flex lg:space-x-4">
					{#each navObject as { name, href } (href)}
						<a {href} class="text-gray-700 hover:text-blue-500">{name}</a>
					{/each}
				</nav>
			</div>
		</div>
	</div>
</header>

{@render children()}
