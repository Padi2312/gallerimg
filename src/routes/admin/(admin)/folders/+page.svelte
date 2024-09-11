<script lang="ts">
	import Folder from '$lib/client/pages/admin/folders/Folder.svelte';
	import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';

	// Images that are not in any folders
	const images = $state([
		{ id: 1, name: 'Image 1', src: 'image1.jpg' },
		{ id: 2, name: 'Image 2', src: 'image2.jpg' },
		{ id: 3, name: 'Image 3', src: 'image3.jpg' },
		{ id: 4, name: 'Image 4', src: 'image4.jpg' },
		{ id: 5, name: 'Image 5', src: 'image5.jpg' },
		{ id: 6, name: 'Image 6', src: 'image6.jpg' },
		{ id: 7, name: 'Image 7', src: 'image7.jpg' },
		{ id: 8, name: 'Image 8', src: 'image8.jpg' },
		{ id: 9, name: 'Image 9', src: 'image9.jpg' },
		{ id: 10, name: 'Image 10', src: 'image10.jpg' }
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
	<button class="btn mb-4" onclick={createFolder}>
		<Fa icon={faPlusCircle} class="mr-2" />
		Create New Folder
	</button>
	<!-- Display Folders -->
	{#if folders.length > 0}
		<h2 class="mb-2 text-xl font-semibold">Folders</h2>
		<div class="grid grid-cols-3 gap-4">
			{#each folders as folder (folder.id)}
				<!-- Use the Folder component -->
				<Folder {folder} onDrop={handleDrop} onRename={() => {}} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.image-container {
		@apply mt-2 flex items-center justify-center rounded-md border border-border bg-bg p-2;
	}
</style>
