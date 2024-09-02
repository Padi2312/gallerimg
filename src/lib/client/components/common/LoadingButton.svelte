<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import LoadingSpinner from './LoadingSpinner.svelte';

	type LoadingButtonProps = {
		children: Snippet;
		loading?: boolean;
		disabled?: boolean;
		onClick?: () => void;
	} & HTMLAttributes<any>;

	let {
		children,
		loading = $bindable(false),
		disabled,
		onClick,
		...props
	}: LoadingButtonProps = $props();
	let _loading = $derived(loading);
</script>

<button
	class="flex items-center space-x-2"
	{...props}
	onclick={() => !disabled && onClick?.()}
	{disabled}
	class:loading
>
	{#if _loading}
		<LoadingSpinner />
	{/if}
	<div>
		{@render children()}
	</div>
</button>

<style>
	.loading {
		opacity: 0.7;
		cursor: not-allowed;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
