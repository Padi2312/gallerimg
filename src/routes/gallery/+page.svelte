<script lang="ts">
	import Gallery from '$lib/client/components/common/gallery/Gallery.svelte';
	import GalleryLightbox from '$lib/client/components/common/gallery/GalleryLightbox.svelte';
	import Photo from '$lib/client/components/common/Photo.svelte';
	import Tag from '$lib/client/components/common/Tag.svelte';
	import Footer from '$lib/client/components/layout/Footer.svelte';
	import Header from '$lib/client/components/layout/Header.svelte';
	import type { TagModel } from '$lib/server/types/database-types';
	import type { ImageDto } from '$lib/shared/types';

	let { data } = $props();
	const images: ImageDto[] = data.images;
	const tags: TagModel[] = data.tags;
	let selectedImage: ImageDto | null = $state(null);
	let selectedTags: TagModel[] = $state([]);

	// Filter images based on selected tags
	let filteredItems = $derived(
		selectedTags.length > 0
			? images.filter((item) => {
					const imgTags = item.tags;
					const selectedTagsNames = selectedTags.map((tag) => tag.name);
					return selectedTagsNames.some((tag) => imgTags.includes(tag));
				})
			: images
	);

	const openLightbox = (image: ImageDto) => {
		selectedImage = image;
	};

	const closeLightbox = () => {
		selectedImage = null;
	};

	function toggleTag(tag: TagModel) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && closeLightbox()} />

{#if selectedImage}
	<GalleryLightbox images={filteredItems} {selectedImage} onClose={closeLightbox} />
{/if}
<div class="container relative mx-auto justify-center bg-bg px-4">
	<div class="my-4 flex flex-wrap gap-2">
		<button
			class="py-0 transition-colors {selectedTags.length === 0
				? 'text-secondary-foreground bg-secondary'
				: 'border-2 border-border bg-transparent'}"
			onclick={() => (selectedTags = [])}
		>
			All
		</button>

		{#each tags as tag}
			<Tag isActive={selectedTags.includes(tag)} onClick={() => toggleTag(tag)}>
				{tag.name}
			</Tag>
		{/each}
	</div>
	<Gallery images={filteredItems} />
</div>
