<script lang="ts">
	type Props = {
		name: string;
		href: string;
	};

	let { name, href }: Props = $props();

	const external = $derived(/^https?:\/\//.test(href));
</script>

<a
	{href}
	class="m-2 hidden items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 sm:inline-flex"
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
>
	{name}
</a>
