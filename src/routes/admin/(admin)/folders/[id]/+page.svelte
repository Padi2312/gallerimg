<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Photo from '$lib/client/components/common/Photo.svelte';
	import { showToast } from '$lib/client/stores/toast-store.svelte';
	import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';

	type FolderIdPageProps = {
		data: PageData;
	};
	let { data }: FolderIdPageProps = $props();

	const removeImageFromFolder = async (imageId: string) => {
		const response = await fetch(`/api/v1/folders/${data.folder.id}/images/${imageId}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			await invalidateAll();
		} else {
			showToast('Failed to remove image from folder', 'error');
		}
	};
</script>

<div class="container mx-auto p-4">
	<div class="mb-6 flex items-center space-x-2">
		<a class="rounded bg-transparent p-1 hover:bg-secondary" href="/admin/folders">
			<Fa icon={faArrowLeft} size="lg" />
		</a>
		<span class="text-2xl">{data.folder.name}</span>
	</div>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each data.folder.images as image}
			<div class="relative">
				<button
					class="btn absolute right-2 top-2 z-20 !p-2"
					onclick={() => removeImageFromFolder(image.id)}
				>
					<Fa icon={faTimes} />
				</button>
				<Photo {image} width={600} onclick={() => {}} />
			</div>
		{:else}
			<p class="text-center text-4xl font-semibold col-span-full">No images available</p>
		{/each}
	</div>
</div>

<style>
</style>
