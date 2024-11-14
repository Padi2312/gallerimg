<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import Photo from '../Photo.svelte';
	import GalleryLightbox from './GalleryLightbox.svelte';

	type GalleryProps = {
		images: ImageDto[];
	};
	let { images }: GalleryProps = $props();
	let selectedImage: ImageDto | null = $state(null);
	const openLightbox = (image: ImageDto) => {
		selectedImage = image;
	};

	const closeLightbox = () => {
		selectedImage = null;
	};
</script>

{#if selectedImage}
	<GalleryLightbox {images} {selectedImage} onClose={closeLightbox} />
{/if}
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
	{#each images as item (item.id)}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
			onclick={() => openLightbox(item)}
		>
			<Photo image={item} width={600} displayActions />
		</div>
	{/each}
</div>

