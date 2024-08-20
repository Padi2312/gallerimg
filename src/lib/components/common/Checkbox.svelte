<script lang="ts">
	import { faCheck } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	type CheckboxProps = {
		checked: boolean;
		disabled?: boolean;
		onchange?: (checked: boolean) => void;
	};

	let { checked = false, disabled = false, onchange }: CheckboxProps = $props();

	function toggle() {
		if (!disabled) {
			checked = !checked;
			onchange?.(checked);
		}
	}
</script>

<label
	class="inline-flex items-center cursor-pointer {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
	for="checkbox"
>
	<div
		class="w-5 h-5 border-2 border-border rounded flex items-center justify-center {checked
			? 'bg-secondary border-primary'
			: 'bg-none'}"
		onclick={toggle}
		onkeydown={(e) => {
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				toggle();
			}
		}}
		tabindex="0"
		role="checkbox"
		aria-checked={checked}
	>
		{#if checked}
			<Fa icon={faCheck} class="w-3 h-3" />
		{/if}
	</div>
</label>

<style>
	/* Add any additional styles here if needed */
</style>
