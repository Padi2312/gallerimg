<script lang="ts">
	import type { ImageDto } from '$lib/types';
	import Image from '$lib/components/common/Image.svelte';

	type GalleryProps = {
		images: ImageDto[];
	};
	let { images }: GalleryProps = $props();
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each images as image (image.id)}
		<Image {image} width={400} showTags />
	{/each}
</div>
