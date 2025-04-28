<script lang="ts">
	type Props = {
		name: string;
		href: string;
		className?: string;
		onClick?: () => void;
	};

	let { name, href, className = '', onClick }: Props = $props();

	const isExternal = $derived(/^https?:\/\//.test(href));
</script>

<a
	{href}
	class={className}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
	onclick={onClick}
>
	{name}
</a>
