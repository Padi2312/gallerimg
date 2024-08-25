<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { SvelteSet } from 'svelte/reactivity';
	import type { ImageDto } from '../../types';
	import Tag from '../common/Tag.svelte';
	import Checkbox from '../common/Checkbox.svelte';
	import LoadingSpinner from '../common/LoadingSpinner.svelte';
	import EditModal from './EditModal.svelte';

	type ImageListProps = {
		images: ImageDto[];
	};
	let { images = [] }: ImageListProps = $props();
	let selectedImages = $state<Set<string>>(new SvelteSet([]));

	let showEditModal = $state(false);
	let currentImage: ImageDto | null = $state(null);
	let isDeleting = $state(false);

	const toggleSelection = (id: string) => {
		if (selectedImages.has(id)) {
			selectedImages.delete(id);
		} else {
			selectedImages.add(id);
		}
	};

	async function deleteSelected() {
		const ids = Array.from(selectedImages);
		try {
			isDeleting = true;
			const response = await fetch('/api/v1/images', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ids })
			});
			if (!response.ok) {
				throw new Error('Failed to delete images');
			}
			isDeleting = false;
			await invalidateAll();
			images = images.filter((img) => !ids.includes(img.id));
			selectedImages.clear();
		} catch (error) {
			console.error('Error deleting images:', error);
		}
	}

	const onClickEdit = (image: ImageDto) => {
		currentImage = image;
		showEditModal = true;
	};

	const onCloseEdit = () => {
		showEditModal = false;
		currentImage = null;
	};
</script>

{#if showEditModal && currentImage}
	<EditModal onClose={onCloseEdit} image={currentImage} />
{/if}

<div class="rounded-lg shadow-sm">
	<div class="bg-primary/10 flex items-center justify-between p-4">
		<span>{selectedImages.size} of {images.length} image(s) selected</span>
		<div class="flex items-center space-x-2">
			<a class="btn" href="/admin/photos/upload"> Upload </a>
			<button
				onclick={deleteSelected}
				disabled={selectedImages.size === 0}
				class="flex items-center justify-center space-x-2 bg-red-500"
			>
				{#if isDeleting}
					<LoadingSpinner />
					<span> Deleting...</span>
				{:else}
					<span> Delete Selected </span>
				{/if}
			</button>
		</div>
	</div>
	<div class="relative w-full overflow-auto">
		<table class="w-full caption-bottom text-sm">
			<thead class="[&_tr]:border-b">
				<tr class="border-b border-border">
					<th class="h-12 w-[50px] px-4 text-left align-middle font-medium">
						<Checkbox
							checked={selectedImages.size === images.length}
							onchange={(e) => {
								if (e) {
									images.forEach((img) => selectedImages.add(img.id));
								} else {
									selectedImages.clear();
								}
							}}
						/>
					</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Image</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Title</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Tags</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Uploaded</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Downloads</th>
					<th class="h-12 px-4 text-left align-middle font-medium">Edit</th>
				</tr>
			</thead>
			<tbody class="[&_tr:last-child]:border-0">
				{#each images as image (image.id)}
					<tr class="border-b border-border">
						<td class="p-4 align-middle">
							<Checkbox
								checked={selectedImages.has(image.id)}
								onchange={() => toggleSelection(image.id)}
							/>
						</td>
						<td class="p-4 align-middle">
							<img
								src={image.url + '?height=200'}
								width="64"
								height="64"
								alt={image.title}
								class="aspect-square rounded-md object-cover"
							/>
						</td>
						<td class="p-4 align-middle font-medium">{image.title}</td>
						<td class="p-4 align-middle">
							<div class="flex flex-wrap gap-2">
								{#each image.tags as tag}
									<Tag>
										{tag}
									</Tag>
								{/each}
							</div>
						</td>
						<td class="p-4 align-middle">{image.createdAt}</td>
						<td class="p-4 align-middle">{image.downloadCount}</td>
						<td class="p-4 align-middle">
							<button onclick={() => onClickEdit(image)}> Edit </button>
							<!-- <a href={`/admin/photos/${image.id}`} class="text-primary">Edit</a> -->
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
