<script lang="ts">
	import type { Snippet } from 'svelte';

	type DropdownProps = {
		isOpen?: boolean;
		children: Snippet;
	};
	let { isOpen = true, children }: DropdownProps = $props();

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (event.target && !(event.target as HTMLElement).closest('.dropdown')) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="dropdown relative">
	<button onclick={toggleDropdown}> Actions </button>

	{#if isOpen}
		<div
			class="absolute right-0 z-50 mt-2 w-48 rounded border border-border bg-bg shadow-lg"
		>
			{@render children()}
		</div>
	{/if}
</div>

<style>
</style>
