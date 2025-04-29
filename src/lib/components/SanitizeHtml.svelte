<script lang="ts">
	import DOMPurify from 'dompurify';

	let { html }: { html: string } = $props();
	let sanitizedHtml: string = '';

	$effect(() => {
		sanitizedHtml = DOMPurify.sanitize(html, {
			USE_PROFILES: { html: true }
		});
	});
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<div class="prose prose-neutral max-w-none">
	{@html sanitizedHtml}
</div>
