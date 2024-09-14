<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import AddImageToFolderModal from '$lib/client/components/admin/AddImageToFolderModal.svelte';
	import LightboxModal from '$lib/client/components/common/LightboxModal.svelte';
	import Folder from '$lib/client/pages/admin/folders/Folder.svelte';
	import { showToast } from '$lib/client/stores/toast-store.svelte';
	import type { FolderDto } from '$lib/shared/types';
	import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';
	import type { PageData } from './$types';

	type FoldersPageProps = {
		data: PageData;
	};
	let { data }: FoldersPageProps = $props();
	let currentSelectedFolder: FolderDto | null = $state(null);
	let showAddModal = $state(false);
	// Folders list

	// Function to create a new folder
	const createFolder = async () => {
		const response = await fetch('/api/v1/folders', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: `New Folder ${data.folders.length + 1}`
			})
		});
		if (response.ok) {
			await invalidateAll();
		} else {
			showToast('Failed to create folder', 'error');
		}
	};

	const onAddClick = (folder: FolderDto) => {
		currentSelectedFolder = folder;
		showAddModal = true;
	};

	const onRenameFolder = async (folder: { id: string; name: string }) => {
		const response = await fetch(`/api/v1/folders/${folder.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: folder.name
			})
		});

		if (!response.ok) {
			showToast('Failed to rename folder', 'error');
		} else {
			await invalidateAll();
		}
	};

	const onOpenFolder = (folder: FolderDto) => {
		goto(`/admin/folders/${folder.id}`);
	};
</script>

{#if currentSelectedFolder}
	<LightboxModal onClose={() => (currentSelectedFolder = null)}>
		<AddImageToFolderModal
			images={data.images}
			folder={currentSelectedFolder}
			onAdd={invalidateAll}
		/>
	</LightboxModal>
{/if}

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Organize Images into Folders</h1>

	<!-- Button to create a new folder -->
	<button class="btn flex items-center space-x-2" onclick={createFolder}>
		<Fa icon={faPlusCircle} />
		<span>Create New Folder</span>
	</button>

	<!-- Display Folders -->
	{#if data.folders.length > 0}
		<h2 class="my-2 text-xl font-semibold">Folders</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
			{#each data.folders as folder (folder.id)}
				<!-- Use the Folder component -->
				<Folder {folder} {onAddClick} onRename={onRenameFolder} onOpenClick={onOpenFolder} />
			{/each}
		</div>
	{/if}
</div>

<style>
</style>
