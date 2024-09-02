<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import { faCircleInfo, faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade } from 'svelte/transition';
	import ExifDataDisplay from '$lib/client/components/common/ExifDataDisplay.svelte';
	import ImageModal from './ImageModal.svelte';
	import Tag from './Tag.svelte';

	type ImageProps = {
		image: ImageDto;
		width?: number;
		height?: number;
		showTags?: boolean;
		displayActions?: boolean;
	};
	let { image, width, height, showTags = false, displayActions = true }: ImageProps = $props();
	let showEnlarged = $state(false);
	let url: string | null = $state(null);
	let exif: any | null = $state(null);
	let showExif = $state(false);

	$effect(() => {
		setImageUrl(image);
	});

	$effect(() => {
		if (showExif && exif === null) {
			fetchExif();
		}
	});

	const setImageUrl = (image: ImageDto) => {
		if (width && height) {
			url = image.url + `?width=${width}&height=${height}`;
		} else if (width) {
			url = image.url + `?width=${width}`;
		} else if (height) {
			url = image.url + `?height=${height}`;
		} else {
			url = image.url + '?width=2000';
		}
	};

	const openImageModal = () => {
		showEnlarged = true;
	};

	const fetchExif = async () => {
		const response = await fetch(`/api/v1/images/${image.id}/exif`);
		exif = await response.json();
	};

	const toggleExif = () => {
		showExif = !showExif;
	};
</script>

{#if showEnlarged}
	<ImageModal {image} onClose={() => (showEnlarged = false)} />
{/if}
<div class="flex flex-col">
	{#if url}
		<div transition:fade>
			<img src={url} alt={image.title} class="h-full w-full rounded-t" loading="lazy" />
		</div>
	{/if}

	{#if displayActions || showTags || showExif}
		<div class="items-cente flex flex-col justify-start rounded-b bg-bg-secondary p-2">
			{#if displayActions}
				<div class="flex space-x-2">
					<button class="btn-overlay" onclick={openImageModal}>
						<Fa icon={faExpand} size="xs" />
					</button>
					<button class="btn-overlay" onclick={toggleExif}>
						<Fa icon={faCircleInfo} size="xs" />
					</button>
					<a
						href="{image.url}?download=true"
						class="btn-overlay"
						onclick={(e) => e.stopImmediatePropagation()}
						download
					>
						<Fa icon={faDownload} size="xs" />
					</a>
				</div>
			{/if}

			{#if showTags}
				<div class="">
					{#each image.tags as tag}
						<Tag>{tag}</Tag>
					{/each}
				</div>
			{/if}

			{#if showExif && exif}
				<ExifDataDisplay metadataModel={exif} />
			{/if}
		</div>
	{/if}
</div>

<style lang="postcss">
	.btn-overlay {
		@apply rounded !bg-gray-300/50 p-1.5 text-text hover:bg-gray-300 dark:bg-gray-600/50 dark:hover:bg-gray-600;
	}
</style>
