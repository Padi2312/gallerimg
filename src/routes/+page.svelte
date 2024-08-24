<script lang="ts">
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
<div class="relative px-4">
	<div class="flex flex-col items-center space-y-4  w-full max-w-3xl overflow-hidden">
		{#each images as image (image.id)}
			<Image {image} width={500} />
		{/each}
	</div>
</div>

<style></style>
