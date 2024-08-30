<script lang="ts">
	import Gallery from '$lib/components/common/Gallery.svelte';
	import Image from '$lib/components/common/Image.svelte';
	import ImageCarousel from '$lib/components/common/ImageCarousel.svelte';
	import type { ImageDto } from '$lib/types';
	import Header from '../lib/components/Header.svelte';

	let { data } = $props();
	const images: ImageDto[] = data.images;
</script>

<Header />
<div class="relative flex h-full w-full flex-col items-center space-y-4 p-4 xl:px-64">
	<ImageCarousel {images} />
	<hr class="w-3/4 p-4" />
</div>
<div class="relative flex justify-center px-4">
	<!-- <div class="flex w-full max-w-3xl flex-col items-center space-y-4 overflow-hidden">
		{#each images as image (image.id)}
			<Image {image} width={800} showTags />
		{/each}
	</div> -->

	<Gallery {images} />
</div>

<style></style>
