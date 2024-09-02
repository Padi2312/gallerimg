<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
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
		class="bg-bg-overlay/50 fixed inset-0 z-40 flex items-center justify-center p-0 lg:p-4"
		onclick={handleOutsideClick}
	>
		<div
			class="relative max-h-screen w-auto max-w-full overflow-auto rounded-lg bg-bg p-2 shadow-lg"
		>
			<button class="absolute right-2 top-2 bg-transparent !p-1 text-text" onclick={close}>
				<Fa icon={faClose} />
			</button>
			<div class="flex items-center justify-center">
				<img
					src={image.url}
					alt={image.title}
					class="h-auto max-h-[80vh] w-auto max-w-full rounded-lg"
				/>
			</div>
		</div>
	</div>
{/if}
