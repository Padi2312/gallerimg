<script lang="ts">
	import LoadingSpinner from './LoadingSpinner.svelte';

	type LoadingButtonProps = {
		label: string;
		loading?: boolean;
		disabled?: boolean;
		onClick?: () => void;
		attrs?: Record<string, any>;
	};
	let {
		label,
		loading = $bindable(false),
		disabled,
		onClick,
		attrs
	}: LoadingButtonProps = $props();
	let _loading = $derived(loading);
</script>

<button
	class="flex items-center space-x-2"
	{...attrs}
	onclick={() => !disabled && onClick?.()}
	{disabled}
	class:loading
>
	{#if _loading}
		<LoadingSpinner />
	{/if}
	<div>
		{label}
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
