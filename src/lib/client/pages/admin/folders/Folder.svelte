<script lang="ts">
	import { Fa } from 'svelte-fa';
	import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

	export let folder;
	export let onDrop;

	// Function to toggle folder open/close
	const toggleFolder = () => {
		folder.isOpen = !folder.isOpen;
	};

	// Function to handle drop events
	const handleDrop = () => {
		onDrop(folder); // Trigger the callback passed from the parent to handle the drop
	};
</script>

<div
	class="cursor-pointer rounded-md border border-border bg-bg-secondary p-4 text-center"
	on:click={toggleFolder}
	on:dragover={(e) => e.preventDefault()}
	on:drop={handleDrop}
>
	<!-- Folder icon -->
	<Fa icon={folder.isOpen ? faFolderOpen : faFolder} class="mb-2 text-6xl text-primary" />
	<span class="block font-semibold">{folder.name}</span>

	<!-- Show images inside folder if it's open -->
	{#if folder.isOpen}
		<div class="mt-4 rounded-md border border-border bg-bg-secondary p-4">
			<!-- Show images inside the folder -->
			{#if folder.images.length > 0}
				{#each folder.images as img}
					<div
						class="mt-2 flex items-center justify-center rounded-md border border-border bg-bg p-2"
					>
						<img src={img.src} alt={img.name} class="mr-2 h-16 w-16 object-cover" />
						<span>{img.name}</span>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.folder-content {
		@apply mt-4 rounded-md border border-border bg-bg-secondary p-4;
	}

	.image-container {
		@apply mt-2 flex items-center justify-center rounded-md border border-border bg-bg p-2;
	}
</style>
