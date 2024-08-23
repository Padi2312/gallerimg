<script lang="ts">
	import Image from '$lib/components/common/Image.svelte';
	import ImageCarousel from '$lib/components/common/ImageCarousel.svelte';
	import type { ImageDto } from '$lib/types';
	import Header from '../lib/components/Header.svelte';

	let { data } = $props();
	const images: ImageDto[] = data.images;
</script>

<Header />
<div class="relative flex h-full w-full flex-col items-center p-4 xl:px-64">
	<ImageCarousel {images} />
</div>
<div class="relative flex flex-col items-center space-y-2 px-4">
	{#each images as image (image.id)}
		<div class="w-full max-w-3xl overflow-hidden">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<Image {image} />
			<!-- <img
				onclick={() => openImageModal(image)}
				data-src={image.url + '?width=2000'}
				alt={image.title}
				class="h-full w-full opacity-0 transition-opacity duration-300"
				loading="lazy"
			/> -->
		</div>
	{/each}
</div>

<style></style>
