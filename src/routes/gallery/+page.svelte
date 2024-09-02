<script lang="ts">
	import Gallery from '$lib/components/common/Gallery.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { ImageDto } from '$lib/types';

	let { data } = $props();
	const images: ImageDto[] = data.images;
</script>

<Header />
<div class="h-screen py-2 md:py-4">
	<div class="relative flex justify-center px-4">
		<Gallery {images} />
	</div>
</div>

<style>
</style>
