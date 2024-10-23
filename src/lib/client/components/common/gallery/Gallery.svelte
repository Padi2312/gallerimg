<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import { onMount } from 'svelte';
	import Photo from '../Photo.svelte';
	import GalleryLightbox from './GalleryLightbox.svelte';

	type GalleryProps = {
		images: ImageDto[];
	};

	let { images }: GalleryProps = $props();

	let columns = $state(4);
	let selectedImage: ImageDto | null = $state(null);
	let columnImages: ImageDto[][] = $state([]);

	// ResizeObserver to listen to container size changes
	let container: HTMLDivElement;

	onMount(() => {
		// Handle initial resize and arrangement before rendering
		handleResize();
		arrangeImages();

		const resizeObserver = new ResizeObserver(() => {
			handleResize();
			arrangeImages();
		});

		if (container) {
			resizeObserver.observe(container);
		}

		return () => {
			if (container) {
				resizeObserver.unobserve(container);
			}
		};
	});

	const handleResize = () => {
		let newColumns;
		if (window.innerWidth < 640) {
			newColumns = 1;
		} else if (window.innerWidth < 1024) {
			newColumns = 2;
		} else if (window.innerWidth < 1280) {
			newColumns = 3;
		} else {
			newColumns = 4;
		}

		if (newColumns !== columns) {
			columns = newColumns;
		}
	};

	const arrangeImages = () => {
		columnImages = Array.from({ length: columns }, () => []);

		images.forEach((image, index) => {
			columnImages[index % columns].push(image);
		});
	};

	const openLightbox = (image: ImageDto) => {
		selectedImage = image;
	};

	const closeLightbox = () => {
		selectedImage = null;
	};
</script>

<div bind:this={container} class="container mx-auto px-0 py-8">
	<div class="gallery">
		{#each columnImages as column, columnIndex}
			<div class="gallery-column">
				{#each column as item, index}
					<button class="gallery-item" onclick={() => openLightbox(item)}>
						<Photo image={item} compress={30} displayActions />
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>

{#if selectedImage}
	<GalleryLightbox {images} {selectedImage} onClose={closeLightbox} />
{/if}

<style lang="postcss">
	.gallery {
		@apply flex flex-wrap gap-0;
	}

	.gallery-column {
		@apply m-0 flex-1;
	}

	.gallery-item {
		@apply mb-0 w-full overflow-hidden rounded p-2;
		transition: transform 0.5s;
	}

	.gallery-item:hover {
		@apply !bg-transparent;
		transform: scale(1.03);
	}
</style>
