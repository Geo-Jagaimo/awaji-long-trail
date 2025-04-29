<script lang="ts">
	let { href, label = 'もっと見る' }: { href: string; label?: string } = $props();
</script>

<a
	{href}
	class="m-2 items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-orange-600 sm:inline-flex"
>
	{label}
</a>
