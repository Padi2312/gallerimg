<script lang="ts">
	import type { Snippet } from 'svelte';

	type TagProps = {
		children: Snippet;
	};

	let { children }: TagProps = $props();
</script>

<div
	class="inline-flex w-fit items-center whitespace-nowrap rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-text"
>
	{@render children()}
</div>
