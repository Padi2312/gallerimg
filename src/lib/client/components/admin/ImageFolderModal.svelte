<script lang="ts">
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import ComboBox from '../common/ComboBox.svelte';

	type ImageFolderModalProps = {
		selectedImages: Set<string>;
		onClose?: () => void;
	};
	let { onClose, selectedImages }: ImageFolderModalProps = $props();

	// Close function
	function close() {
		onClose?.();
	}

	// Handle click outside modal to close it
	function handleOutsideClick(event: Event) {
		if (event.target === event.currentTarget) {
			close();
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed inset-0 z-10 flex items-center justify-center bg-bg-secondary/70"
	onclick={handleOutsideClick}
>
	<div class="relative w-full max-w-lg rounded-lg bg-bg p-4 shadow-lg">
		<button class="absolute right-1 top-1 bg-transparent !p-2 text-text" onclick={close}>
			<Fa icon={faClose} />
		</button>
		<div class="mb-4 text-center font-medium">Add images to folder</div>
		<div class="mb-4">
			<ComboBox suggestions={[]} />
		</div>
		<div class="grid grid-cols-1 gap-4">
			{#each selectedImages as img}
				<div class="flex items-center gap-2">
					<img src={img} alt="image" class="h-12 w-12 rounded-lg object-cover" />
					<div class="flex-1">{img}</div>
				</div>
			{/each}
		</div>
	</div>
</div>
