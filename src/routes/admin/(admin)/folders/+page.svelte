<script lang="ts">
	import Folder from '$lib/client/pages/admin/folders/Folder.svelte';
	import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';

	// Images that are not in any folders
	const images = $state([
		{ id: 1, name: 'Image 1', src: 'image1.jpg' },
		{ id: 2, name: 'Image 2', src: 'image2.jpg' },
		{ id: 3, name: 'Image 3', src: 'image3.jpg' }
	]);

	// Folders list
	const folders = $state([]);

	// Variable to store the image being dragged
	let draggedImage = null;

	// Function to create a new folder
	const createFolder = () => {
		const newFolder = {
			id: crypto.randomUUID(),
			name: `New Folder ${folders.length + 1}`,
			images: [],
			isOpen: false // Toggle to open/close folder
		};
		folders.push(newFolder);
	};

	// Drag event: Capture the image being dragged
	const handleDragStart = (image) => {
		draggedImage = image;
	};

	// Drop event: Add the dragged image to the target folder
	const handleDrop = (folder) => {
		if (draggedImage) {
			folder.images.push(draggedImage);
			// Remove the image from unorganized images
			images.splice(images.indexOf(draggedImage), 1);
			draggedImage = null;
		}
	};
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Organize Images into Folders</h1>

	<!-- Button to create a new folder -->
	<button class="btn mb-4" on:click={createFolder}>
		<Fa icon={faPlusCircle} class="mr-2" />
		Create New Folder
	</button>

	<!-- Display Unorganized Images -->
	<div class="mb-6">
		<h2 class="mb-2 text-xl font-semibold">Unorganized Images</h2>
		<div class="grid grid-cols-3 gap-4">
			{#each images as image}
				<div
					class="rounded-md border border-border bg-bg-secondary p-4 text-center"
					draggable="true"
					on:dragstart={() => handleDragStart(image)}
				>
					<img src={image.src} alt={image.name} class="mx-auto mb-2 h-32 w-full object-cover" />
					<span>{image.name}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Display Folders -->
	{#if folders.length > 0}
		<h2 class="mb-2 text-xl font-semibold">Folders</h2>
		<div class="grid grid-cols-3 gap-4">
			{#each folders as folder}
				<!-- Use the Folder component -->
				<Folder {folder} onDrop={handleDrop} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.image-container {
		@apply mt-2 flex items-center justify-center rounded-md border border-border bg-bg p-2;
	}
</style>
