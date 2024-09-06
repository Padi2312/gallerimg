<script lang="ts">
	import Gallery from '$lib/client/components/common/Gallery.svelte';
	import Footer from '$lib/client/components/layout/Footer.svelte';
	import Header from '$lib/client/components/layout/Header.svelte';
	import type { TagModel } from '$lib/server/types/database-types.js';
	import type { ImageDto } from '$lib/shared/types/index.js';

	let { data } = $props();
	const images: ImageDto[] = data.images;
	const tags: TagModel[] = data.tags;
</script>

<Header />
<div class="h-screen py-2 md:py-4">
	<div class="relative flex justify-center bg-bg px-4">
		<Gallery {images} {tags} />
	</div>
	<Footer />
</div>

<style>
</style>
