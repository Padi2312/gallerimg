<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { showToast } from '$lib/client/stores/toast-store.svelte';
	import type { FolderDto, ImageDto } from '$lib/shared/types';
	import Image from '../common/Photo.svelte';

	type AddImageToFolderModalProps = {
		images: ImageDto[];
		folder: FolderDto;
		onAdd: () => void;
	};
	let { images, folder, onAdd }: AddImageToFolderModalProps = $props();

	const addImageToFolder = async (image: ImageDto) => {
		// Logic to add the image to the folder
		const response = await fetch(`/api/v1/folders/images`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				folderId: folder.id,
				imageId: image.id
			})
		});

		if (!response.ok) {
			showToast('Failed to add image to folder', 'error');
		} else {
			onAdd();
		}
	};
</script>

<div
	class="max-h-full min-h-96 min-w-96 max-w-full overflow-y-auto overflow-x-hidden rounded-lg bg-bg p-4"
>
	<h2 class="mb-4 text-center text-xl">
		Add Image to Folder <i>{folder.name}</i>
	</h2>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each images as image}
			<div class="col-span-1">
				<Image {image} width={600} onclick={() => addImageToFolder(image)} />
			</div>
		{:else}
			<div class="flex w-full h-full justify-center items-center col-span-full row-span-full">
				<p class="text-center text-lg font-semibold">No images available</p>
			</div>
		{/each}
	</div>
</div>
