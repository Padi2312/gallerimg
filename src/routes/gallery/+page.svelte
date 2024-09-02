<script lang="ts">
	import Gallery from '$lib/client/components/common/Gallery.svelte';
	import Header from '$lib/client/components/layout/Header.svelte';
	import type { ImageDto } from '$lib/shared/types/index.js';

	let { data } = $props();
	const images: ImageDto[] = data.images;
</script>

<Header />
<div class="h-screen py-2 md:py-4">
	<div class="relative flex justify-center bg-bg px-4">
		<Gallery {images} />
	</div>
</div>

<style>
</style>
