<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import {
		faCircleInfo,
		faClose,
		faDownload,
		faUpRightAndDownLeftFromCenter
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade, slide } from 'svelte/transition';
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

	const downloadImage = () => {
		const a = document.createElement('a');
		a.href = image.url + '?download=true';
		a.download = image.title;
		a.click();
	};

	const openImageModal = () => {
		showEnlarged = true;
	};

	const fetchExif = async () => {
		const response = await fetch(`/api/v1/images/${image.id}/exif`);
		let data = await response.json();
		delete data.id;
		delete data.image_id;
		delete data.date_time_original;
		exif = data;
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
		<div class="relative" transition:fade>
			<img src={url} alt={image.title} class="h-full w-full rounded-t" loading="lazy" />

			{#if showExif && exif}
				<div
					transition:slide
					class="absolute inset-0 flex items-end bg-black bg-opacity-50 px-6 pb-10"
				>
					<div class="grid w-full grid-cols-2 text-white">
						{#each Object.entries(exif) as [key, value]}
							<div class="flex flex-col">
								<span class="text-xs uppercase tracking-wide opacity-75">{key}</span>
								<span class="text-sm font-semibold">{value}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
			<div class="absolute bottom-1 right-1">
				{#if displayActions}
					<div class="flex space-x-2">
						<button class="border border-text bg-transparent p-1.5" onclick={toggleExif}>
							<Fa icon={showExif ? faClose : faCircleInfo} size="xs" />
						</button>
						<button class="border border-text bg-transparent p-1.5" onclick={downloadImage}>
							<Fa icon={faDownload} size="xs" />
						</button>
						<button class="border border-text bg-transparent p-1.5" onclick={openImageModal}>
							<Fa icon={faUpRightAndDownLeftFromCenter} size="xs" />
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	{#if showTags}
		<div class="py-1">
			{#each image.tags as tag}
				<Tag>{tag}</Tag>
			{/each}
		</div>
	{/if}
</div>

<style>
</style>
