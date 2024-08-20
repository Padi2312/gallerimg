<script lang="ts">
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import FileUploadForm from '../common/FileUploadForm.svelte';

	type UploadModalProps = {
		show?: boolean;
		allowBackdrop?: boolean;
		onClose?: () => void;
	};
	let { onClose, show = true, allowBackdrop = true }: UploadModalProps = $props();

	function handleOutsideClick(event: Event) {
		if (event.target === event.currentTarget && allowBackdrop) {
			close();
		}
	}

	const close = () => {
		onClose?.();
		show = false;
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if show}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-10 flex items-center justify-center bg-bg-overlay"
		onclick={handleOutsideClick}
	>
		<div class="relative w-full max-w-lg rounded-lg bg-bg p-4 shadow-lg">
			<button class="absolute right-1 top-1 bg-transparent !p-2 text-text" onclick={close}>
				<Fa icon={faClose} />
			</button>
			<p class="mb-2 text-center font-medium">Select files to upload:</p>
			<FileUploadForm />
		</div>
	</div>
{/if}
