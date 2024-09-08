<script lang="ts">
	import type { Snippet } from 'svelte';

	type DropdownItemProps = {
		disabled?: boolean;
		onClick?: () => void;
		children: Snippet;
	};
	let { disabled = false, onClick = () => {}, children }: DropdownItemProps = $props();

	function handleClick() {
		if (!disabled) {
			onClick();
		}
	}
</script>

<button class="w-full bg-bg hover:bg-bg-secondary" onclick={handleClick} {disabled}>
	{@render children()}
</button>

<style>
</style>
