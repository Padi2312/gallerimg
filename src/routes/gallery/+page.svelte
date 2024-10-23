<script lang="ts">
	import Gallery from '$lib/client/components/common/gallery/Gallery.svelte';
	import type { ImageDto } from '$lib/shared/types';

	let { data } = $props();
	const images: ImageDto[] = data.images;
</script>

<div class="container relative mx-auto justify-center bg-bg px-4">
	<Gallery {images} />
</div>
