<script lang="ts">
	import { faTimes } from '@fortawesome/free-solid-svg-icons';
	import type { Snippet } from 'svelte';
	import Fa from 'svelte-fa';

	type TagProps = {
		children: Snippet;
		onDelete?: () => void;
	};

	let { children, onDelete }: TagProps = $props();
</script>

<div
	class="inline-flex w-fit items-center whitespace-nowrap rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-text shadow"
>
	{@render children()}
	{#if onDelete}
		<button type="button" class="ms-2 bg-transparent p-1" onclick={onDelete}>
			<Fa icon={faTimes} class="h-3 w-3" />
		</button>
	{/if}
</div>
