<script lang="ts">
	import { faTimes } from '@fortawesome/free-solid-svg-icons';
	import type { Snippet } from 'svelte';
	import Fa from 'svelte-fa';

	type LightboxModalProps = {
		children: Snippet;
		onClose?: () => void;
	};
	let { children, onClose }: LightboxModalProps = $props();

	function handleOutsideClick(event: Event) {
		if (event.target === event.currentTarget) {
			onClose?.();
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- Main Lightbox Container -->
<div
	id="lightbox"
	class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-90"
	onclick={handleOutsideClick}
>
	<!-- Close button -->
	<button onclick={onClose} class="z-10 absolute right-4 top-4 p-2">
		<Fa icon={faTimes} size="sm" />
	</button>

	<!-- <div class="max-h-full max-w-full overflow-hidden"> -->
	{@render children()}
	<!-- </div> -->
</div>

<style>
</style>
