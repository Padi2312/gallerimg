<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Checkbox from '$lib/client/components/common/Checkbox.svelte';
	import Tag from '$lib/client/components/common/Tag.svelte';
	import type { ImageDto } from '$lib/shared/types';
	import { faSort } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { SvelteSet } from 'svelte/reactivity';
	import Dropdown from '../common/Dropdown.svelte';
	import DropdownItem from '../common/DropdownItem.svelte';
	import ImageModal from '../common/ImageModal.svelte';
	import EditModal from './EditModal.svelte';
	import ImageFolderModal from './ImageFolderModal.svelte';

	type ImageListProps = {
		images: ImageDto[];
	};
	let { images = [] }: ImageListProps = $props();
	let selectedImages = $state<Set<string>>(new SvelteSet([]));
	let showEditModal = $state(false);
	let currentImage: ImageDto | null = $state(null);
	let showFoldersModal = $state(false);
	let isDeleting = $state(false);
	let searchTerm = $state('');
	let filteredImages: ImageDto[] = $state([]);
	let sortColumn: keyof ImageDto | null = null;
	let sortOrder: 'asc' | 'desc' = $state('asc');
	let toEnlargImage: ImageDto | null = $state(null);

	$effect(() => {
		// Apply search filter
		filteredImages = images.filter((image) => {
			const matchesSearchTerm =
				searchTerm === '' ||
				image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
			return matchesSearchTerm;
		});
	});

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

	// Sorting function
	function sortBy(column: keyof ImageDto) {
		if (sortColumn === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortOrder = 'asc';
		}
		images = [...images].sort((a, b) => {
			const valueA = a[column];
			const valueB = b[column];
			if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
			if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});
	}
</script>

{#if showEditModal && currentImage}
	<EditModal onClose={onCloseEdit} image={currentImage} />
{/if}

{#if toEnlargImage}
	<ImageModal image={toEnlargImage} onClose={() => (toEnlargImage = null)} />
{/if}

{#if showFoldersModal}
	<ImageFolderModal {selectedImages} onClose={() => (showFoldersModal = false)} />
{/if}

<div class="rounded-lg shadow-sm">
	<div class="flex items-center justify-between rounded bg-bg-secondary p-4">
		<span>{selectedImages.size} of {images.length} image(s) selected</span>
		<Dropdown>
			<DropdownItem onClick={deleteSelected} disabled={selectedImages.size === 0 || isDeleting}>
				{#if isDeleting}
					<span>Deleting...</span>
				{:else}
					Delete Selected
				{/if}
			</DropdownItem>
			<DropdownItem disabled={selectedImages.size === 0} onClick={() => (showFoldersModal = true)}
				>Add to folder</DropdownItem
			>
		</Dropdown>
	</div>
	<div class="py-4">
		<input
			class="w-full rounded border border-border p-2"
			placeholder="Search..."
			bind:value={searchTerm}
		/>
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
					{#snippet sortingTableHeader(by: keyof ImageDto, label: string)}
						<th
							class="h-12 cursor-pointer items-center px-4 text-left align-middle font-medium"
							onclick={() => sortBy(by)}
						>
							<div class="flex items-center space-x-2">
								<Fa icon={faSort} />
								<span>
									{label}
								</span>
							</div>
						</th>
					{/snippet}
					{@render sortingTableHeader('title', 'Title')}
					{@render sortingTableHeader('tags', 'Tags')}
					{@render sortingTableHeader('createdAt', 'Uploaded')}
					{@render sortingTableHeader('downloadCount', 'Downloads')}
					<th class="h-12 px-4 text-left align-middle font-medium">Edit</th>
				</tr>
			</thead>
			<tbody class="[&_tr:last-child]:border-0">
				{#each filteredImages as image (image.id)}
					<tr class="border-b border-border">
						<td class="p-4 align-middle">
							<Checkbox
								checked={selectedImages.has(image.id)}
								onchange={() => toggleSelection(image.id)}
							/>
						</td>
						<td
							class="p-2 align-middle transition-transform duration-150 hover:scale-110"
							onclick={() => (toEnlargImage = image)}
						>
							<img
								src={image.url + '?height=150'}
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
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
