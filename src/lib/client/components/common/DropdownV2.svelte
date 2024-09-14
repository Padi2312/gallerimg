<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';

	type DropdownV2Props = {
		onclose: () => void;
		children: Snippet;
	};
	let { onclose, children }: DropdownV2Props = $props();

	// Provide the onclose function to child components via context
	setContext('closeDropdown', onclose);

	const handleClickOutside = (event: MouseEvent) => {
		const dropdown = document.getElementById('dropdown');
		if (dropdown && !dropdown.contains(event.target as Node)) {
			onclose();
		}
	};
</script>

<svelte:document onclick={handleClickOutside} />
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="dropdown" class="relative inline-block text-left">
	<div class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-bg shadow-lg">
		<div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
			{@render children()}
		</div>
	</div>
</div>

<style>
	/* Add your styles here if needed */
</style>
