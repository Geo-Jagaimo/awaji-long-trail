<script lang="ts">
	import DOMPurify from 'dompurify';

	let { html }: { html: string } = $props();
	let sanitizedHtml: string = $state('');

	$effect(() => {
		sanitizedHtml = DOMPurify.sanitize(html);
	});
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<div class="prose prose-neutral max-w-none">
	{@html sanitizedHtml}
</div>
