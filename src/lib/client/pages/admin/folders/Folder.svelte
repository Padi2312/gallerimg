<script lang="ts">
	import { Fa } from 'svelte-fa';
	import { faFolder, faFolderOpen, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

	type FolderProps = {
		folder: {
			id: string;
			name: string;
			images: { id: number; name: string; src: string }[];
			isOpen: boolean;
		};
		onDrop: (folder: {
			id: string;
			name: string;
			images: { id: number; name: string; src: string }[];
		}) => void;
		onRename: (folder: { id: string; name: string }) => void;
	};
	let { folder, onDrop }: FolderProps = $props();
	let isRenaming = $state(false);

	// Function to toggle folder open/close
	const toggleFolder = () => {
		folder.isOpen = !folder.isOpen;
	};

	// Function to handle drop events
	const handleDrop = () => {
		onDrop(folder); // Trigger the callback passed from the parent to handle the drop
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex cursor-pointer flex-col justify-items-center rounded-md border border-border bg-bg-secondary p-4 text-center"
	onclick={toggleFolder}
	ondragover={(e) => e.preventDefault()}
	ondrop={handleDrop}
>
	<!-- Folder icon -->
	<div class="relative flex items-center justify-center">
		<Fa icon={folder.isOpen ? faFolderOpen : faFolder} class="text-6xl text-primary" />
		<button class="absolute -bottom-2 right-4 bg-transparent p-1" onclick={handleDrop}>
			<Fa icon={faPlusCircle} />
		</button>
	</div>

	{#if !isRenaming}
		<span class="block font-semibold" ondblclick={() => (isRenaming = true)}>{folder.name}</span>
	{:else}
		<input type="text" bind:value={folder.name} onblur={() => (isRenaming = false)} autofocus />
	{/if}

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
