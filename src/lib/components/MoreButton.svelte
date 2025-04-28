<script lang="ts">
    let { href, label = 'もっと見る' }: { href: string; label?: string } = $props();
</script>

<a
    {href}
    class="m-2 items-center justify-center bg-orange-500 px-4 py-2 text-sm font-semibold text-white rounded-full shadow-md hover:bg-orange-600 transition-colors duration-200 sm:inline-flex"
>
    {label}
</a>
