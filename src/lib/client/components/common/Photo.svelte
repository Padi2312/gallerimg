<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import { faCircleInfo, faClose, faDownload } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { fade, slide } from 'svelte/transition';

	type ImageProps = {
		image: ImageDto;
		compress?: number;
		width?: number;
		height?: number;
		displayActions?: boolean;
		onclick?: () => void;
	};
	let { image, width, height, compress, displayActions = true, onclick }: ImageProps = $props();
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
		const params = new URLSearchParams();
		if (width) params.append('width', width.toString());
		if (height) params.append('height', height.toString());
		if (compress) params.append('compress', compress.toString());
		url = `${image.url}?${params.toString()}`;
	};

	const downloadImage = (event: Event) => {
		const a = document.createElement('a');
		a.href = image.url + '?download=true';
		a.download = image.title;
		a.click();
	};

	const fetchExif = async () => {
		const response = await fetch(`/api/v1/images/${image.id}/exif`);
		let data = await response.json();
		delete data.id;
		delete data.image_id;
		delete data.date_time_original;
		exif = data;
	};

	const toggleExif = (event: Event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
		showExif = !showExif;
	};
</script>

<div class="flex flex-col">
	{#if url}
		<div class="relative" transition:fade>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<img src={url} alt={image.title} {onclick} class="h-full w-full rounded-t" loading="lazy" />

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
						{#snippet actionButton(icon: any, text: string, onClick: any)}
							<button
								class="group relative border !border-white bg-transparent p-1.5 text-white"
								onclick={onClick}
							>
								<Fa {icon} size="xs" />
								<span
									class="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 transform rounded-md bg-bg-secondary px-2 py-1 text-xs font-medium text-text opacity-0 transition-opacity duration-100 group-hover:opacity-100"
								>
									{text}
								</span>
							</button>
						{/snippet}
						{@render actionButton(showExif ? faClose : faCircleInfo, 'Info', toggleExif)}
						{@render actionButton(faDownload, 'Download', downloadImage)}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
</style>
