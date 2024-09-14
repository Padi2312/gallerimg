<script lang="ts">
	import Image from '$lib/client/components/common/Photo.svelte';
	import type { TagModel } from '$lib/server/types/database-types';
	import type { ImageDto } from '$lib/shared/types';
	import Tag from './Tag.svelte';
	import GalleryLightbox from './gallery/GalleryLightbox.svelte';

	type GalleryProps = {
		images: ImageDto[];
		tags: TagModel[];
	};
	let { images, tags: tagList }: GalleryProps = $props();

	let selectedImage: ImageDto | null = $state(null);
	let selectedTags: TagModel[] = $state([]);
	let currentIndex = $state(0);
	let currentTranslateX = $state(0);
	let imageWidth = 0;
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
		currentIndex = filteredItems.findIndex((img) => img.id === image.id);
		currentTranslateX = -currentIndex * imageWidth;
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

<div class="container mx-auto p-4">
	<div class="mb-4 flex flex-wrap gap-2">
		<button
			class="py-0 transition-colors {selectedTags.length === 0
				? 'text-secondary-foreground bg-secondary'
				: 'border-2 border-border bg-transparent'}"
			onclick={() => (selectedTags = [])}
		>
			All
		</button>

		{#each tagList as tag}
			<Tag isActive={selectedTags.includes(tag)} onClick={() => toggleTag(tag)}>
				{tag.name}
			</Tag>
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
		{#each filteredItems as item (item.id)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
				onclick={() => openLightbox(item)}
			>
				<Image image={item} width={600} showTags displayActions />
			</div>
		{/each}
	</div>

	{#if selectedImage}
		<GalleryLightbox images={filteredItems} {selectedImage} onClose={closeLightbox} />
	{/if}
</div>
