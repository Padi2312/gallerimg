<script lang="ts">
	import { faTimes } from '@fortawesome/free-solid-svg-icons';
	import type { Snippet } from 'svelte';
	import Fa from 'svelte-fa';

	type TagProps = {
		isActive?: boolean;
		children: Snippet;
		onClick?: () => void;
		onDelete?: () => void;
	};

	let { isActive, onClick, children, onDelete }: TagProps = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="{isActive
		? 'bg-secondary'
		: 'bg-transparent'} inline-flex whitespace-nowrap rounded-lg border border-border px-2 py-1 text-xs font-semibold shadow hover:bg-secondary"
	onclick={onClick}
>
	{@render children()}
	{#if onDelete}
		<button type="button" class="ms-2 p-1" onclick={onDelete}>
			<Fa icon={faTimes} class="h-3 w-3" />
		</button>
	{/if}
</div>
