<script lang="ts">
	import ImageCarousel from '$lib/components/common/ImageCarousel.svelte';
	import type { ImageDto } from '$lib/types';
	import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import Header from '../lib/components/Header.svelte';

	let { data } = $props();
	const images: ImageDto[] = data.images;
	let showScrollIndicator = $state(true);

	function handleInitialScroll() {
		if (window.scrollY > 50) {
			showScrollIndicator = false;
			window.removeEventListener('scroll', handleInitialScroll);
			window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
		}
	}

	onMount(() => {
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
		window.addEventListener('scroll', handleInitialScroll);

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', handleInitialScroll);
		};
	});
</script>

<Header />
<div class="relative flex h-screen w-full flex-col items-center justify-center">
	<div class="mb-8 max-h-full max-w-full">
		<ImageCarousel {images} />
	</div>
	{#if showScrollIndicator}
		<div class="flex flex-col items-center">
			<Fa size="lg" icon={faChevronDown} class="animate-bounce" />
			<p class="text-xs">Scroll down for more</p>
		</div>
	{/if}
</div>
<div class="relative flex flex-col items-center space-y-2 px-4">
	{#each images as image (image.id)}
		<div class="w-full max-w-3xl overflow-hidden">
			<img
				data-src={image.url + '?width=400'}
				alt={image.title}
				class="h-full w-full opacity-0 transition-opacity duration-300"
				loading="lazy"
			/>
		</div>
	{/each}
</div>

<style></style>
