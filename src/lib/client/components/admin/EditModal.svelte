<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { invalidateAll } from '$app/navigation';
	import TagInput from '$lib/client/components/common/TagInput.svelte';

	type EditModalProps = {
		show?: boolean;
		allowBackdrop?: boolean;
		onClose?: () => void;
		image: ImageDto;
	};
	let { onClose, show = true, allowBackdrop = true, image }: EditModalProps = $props();

	// State variables using Svelte 5's $state
	let title = $state(image.title);
	let tags: string[] = $state(image.tags);
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

	// Save changes function
	const handleSave = async () => {
		const response = await fetch(`/api/v1/images/${image.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, tags, description })
		});

		if (!response.ok) {
			console.error('Failed to save changes');
		} else {
			invalidateAll();
			close();
		}
	};
</script>

{#if show}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-10 flex items-center justify-center bg-bg-overlay"
		onclick={handleOutsideClick}
	>
		<div class="relative w-full max-w-lg rounded-lg bg-bg p-4 shadow-lg">
			<button class="absolute right-1 top-1 bg-transparent !p-2 text-text" onclick={close}>
				<Fa icon={faClose} />
			</button>
			<div class="mb-4 text-center font-medium">Upload Image Details</div>
			<div class="mb-4">
				<img src={image.url + '?width=400'} alt={image.title} class="w-full rounded-lg" />
			</div>
			<div class="mb-4">
				<label for="title" class="mb-2 block text-sm font-medium">Title</label>
				<input
					id="title"
					name="title"
					type="text"
					class="w-full"
					bind:value={title}
					placeholder="Enter a title for the image"
				/>
			</div>
			<div class="mb-4">
				<label for="tags" class="mb-2 block text-sm font-medium">Tags</label>
				<TagInput bind:tags />
			</div>
			<!-- <div class="mb-4">
				<label for="description" class="block text-sm font-medium">Description</label>
				<textarea
					id="description"
					name="description"
					class="w-full"
					bind:value={description}
					placeholder="Enter a description for the image"
				></textarea>
			</div> -->
			<button class="w-full rounded-lg" onclick={handleSave}> Save Changes </button>
		</div>
	</div>
{/if}
