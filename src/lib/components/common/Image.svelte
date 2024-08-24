<script lang="ts">
	import type { ImageDto } from '$lib/types';
	import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import ImageModal from './ImageModal.svelte';

	type ImageProps = {
		image: ImageDto;
		width?: number;
		height?: number;
	};
	let { image, width, height }: ImageProps = $props();
	let showEnlarged = $state(false);
	let url = $state(image.url);

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target as HTMLImageElement;
						img.src = img.dataset.src || '';
						img.onload = () => {
							img.style.opacity = '1';
							img.animate(
								[
									{ transform: 'translateY(20px)', opacity: 0 },
									{ transform: 'translateY(0)', opacity: 1 }
								],
								{ duration: 300, easing: 'ease-out', fill: 'forwards' }
							);
						};
						observer.unobserve(img);
					}
				});
			},
			{ rootMargin: '100px', threshold: 0.1 }
		);
		document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
		getImageUrl(image);
		return () => {
			observer.disconnect();
		};
	});

	const getImageUrl = (image: ImageDto) => {
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
</script>

{#if showEnlarged}
	<ImageModal {image} onClose={() => (showEnlarged = false)} />
{/if}
<div class="relative">
	<img data-src={url} alt={image.title} class="h-full w-full rounded" loading="lazy" />
	<div class="absolute bottom-1 right-1 z-10 flex space-x-2">
		<a
			href="{image.url}?download=true"
			class="btn btn-overlay"
			onclick={(e) => e.stopImmediatePropagation()}
			download
		>
			<Fa icon={faDownload} size="xs" />
		</a>

		<button class="btn-overlay" onclick={openImageModal}>
			<Fa icon={faExpand} size="xs" />
		</button>
	</div>
</div>

<style lang="postcss">
	.btn-overlay {
		@apply bg-gray-600/50 p-1.5 hover:bg-gray-600;
	}
</style>
