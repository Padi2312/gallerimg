<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';

	type DropdownItemProps = {
		disabled?: boolean;
		onClick?: () => void;
		children: Snippet;
	};
	let { disabled = false, onClick = () => {}, children }: DropdownItemProps = $props();

	// Retrieve the closeDropdown function from context
	const closeDropdown = getContext('closeDropdown') as () => void;

	function handleClick(e: Event) {
		e.stopImmediatePropagation();
		if (!disabled) {
			onClick();
			// Close the dropdown after item is clicked
			closeDropdown();
		}
	}
</script>

<button
	id="dropdown-item"
	class="w-full bg-bg text-left text-sm hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
	onclick={handleClick}
	{disabled}
>
	{@render children()}
</button>

<style>
	/* Add your styles here if needed */
</style>
