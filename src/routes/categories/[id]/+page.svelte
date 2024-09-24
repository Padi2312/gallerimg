<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Photo from '$lib/client/components/common/Photo.svelte';
	import { showToast } from '$lib/client/stores/toast-store.svelte';
	import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import type { FolderDto, ImageDto } from '$lib/shared/types';
	import GalleryLightbox from '$lib/client/components/common/gallery/GalleryLightbox.svelte';
	import Gallery from '$lib/client/components/common/gallery/Gallery.svelte';

	type FolderIdPageProps = {
		data: PageData;
	};
	let { data }: FolderIdPageProps = $props();
	let selectedImage: ImageDto | null = $state(null);
</script>

{#if selectedImage}
	<GalleryLightbox
		images={data.folder.images}
		{selectedImage}
		onClose={() => (selectedImage = null)}
	/>
{/if}
<div class="container mx-auto h-full min-h-screen p-4">
	<div class="mb-6 flex items-center space-x-2">
		<a class="rounded bg-transparent p-1 hover:bg-secondary" href="/categories">
			<Fa icon={faArrowLeft} size="lg" />
		</a>
		<span class="text-2xl">{data.folder.name}</span>
	</div>

	<Gallery images={data.folder.images} />
</div>

<style>
</style>
