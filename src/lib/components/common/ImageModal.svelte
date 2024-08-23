<script lang="ts">
	import type { ImageDto } from '$lib/types';
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	type ImageModalProps = {
		show?: boolean;
		allowBackdrop?: boolean;
		onClose?: () => void;
		image: ImageDto;
	};
	let { onClose, show = true, allowBackdrop = true, image }: ImageModalProps = $props();

	// State variables using Svelte 5's $state
	let title = $state(image.title);
	let tags = $state(image.tags.join(', '));
	let description = $state('');

	// Close function
	function close() {
		onClose?.();
		show = false;
	}

	// Handle click outside modal to close it
	function handleOutsideClick(event: Event) {
		if (event.target === event.currentTarget && allowBackdrop) {
			close();
		}
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-10 flex items-center justify-center bg-bg-overlay"
		onclick={handleOutsideClick}
	>
		<div class="relative w-full rounded-lg bg-bg p-6 shadow-lg">
			<button class="absolute right-1 top-0 bg-transparent !p-2 text-text" onclick={close}>
				<Fa icon={faClose} />
			</button>
			<div class="mb-4">
				<img src={image.url} alt={image.title} class="w-full rounded-lg" />
			</div>
		</div>
	</div>
{/if}
