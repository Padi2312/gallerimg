<!-- <script lang="ts">
	import type { ImageDto } from '$lib/types';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { blur } from 'svelte/transition';

	type CarouselProps = {
		images: ImageDto[];
	};
	let { images = [] }: CarouselProps = $props();

	let currentIndex = $state(0);
	let currentImage = $derived(images[currentIndex]);
	let intervalId: any;

	$effect(() => {
		intervalId = setInterval(() => {
			setSlide((currentIndex + 1) % images.length);
		}, 3000);

		return () => clearInterval(intervalId);
	});

	const nextSlide = () => {
		clearInterval(intervalId);
		currentIndex = (currentIndex + 1) % images.length;
	};

	const prevSlide = () => {
		clearInterval(intervalId);
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	};

	const setSlide = (index: number) => {
		currentIndex = index;
	};
</script> -->
<script lang="ts">
	import type { ImageDto } from '$lib/types';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { blur } from 'svelte/transition';

	type CarouselProps = {
		images: ImageDto[];
	};
	let { images = [] }: CarouselProps = $props();

	let currentIndex = $state(0);
	let currentImage = $derived(images[currentIndex]);
	let intervalId: any;
	let inViewport = $state(true);

	const carouselRef = (node: HTMLDivElement) => {
		if (node) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						inViewport = true;
					} else {
						inViewport = false;
						clearInterval(intervalId);
					}
				});
			});

			observer.observe(node);
		}
	};

	$effect(() => {
		if (inViewport) {
			intervalId = setInterval(() => {
				setSlide((currentIndex + 1) % images.length);
			}, 3000);
		}
		return () => clearInterval(intervalId);
	});

	const nextSlide = () => {
		clearInterval(intervalId);
		currentIndex = (currentIndex + 1) % images.length;
	};

	const prevSlide = () => {
		clearInterval(intervalId);
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	};

	const setSlide = (index: number) => {
		currentIndex = index;
	};
</script>

<div class="relative mx-auto h-full w-full max-w-6xl" use:carouselRef>
	<div class="aspect-[1/1] overflow-hidden rounded-lg">
		<div class="relative h-full w-full">
			<div class="h-full overflow-hidden">
				{#each images as image (image.id)}
					<!-- {#if image.id === currentImage.id} -->
					<img
						in:blur
						src={currentImage.url + '?width=800'}
						alt={currentImage.title}
						class="h-full w-full transform object-contain"
					/>
					<!-- {/if} -->
				{/each}
			</div>
			<button
				onclick={prevSlide}
				class="absolute left-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 justify-center rounded-full"
			>
				<Fa icon={faArrowLeft} class="h-4 w-4" />
				<span class="sr-only">Previous slide</span>
			</button>
			<button
				onclick={nextSlide}
				class="absolute right-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 justify-center rounded-full"
			>
				<Fa icon={faArrowRight} class="h-4 w-4" />
				<span class="sr-only">Next slide</span>
			</button>
		</div>
	</div>
	<div class="mt-4 flex justify-center gap-4">
		{#each images as image, index}
			<button
				onclick={() => setSlide(index)}
				class="inline-flex h-12 w-12 items-center justify-center overflow-hidden border-border p-0 hover:scale-125"
				class:border={currentIndex === index}
				class:scale-125={currentIndex === index}
			>
				<img
					src={image.url + '?width=100'}
					alt={`Thumbnail ${index + 1}`}
					class="h-full w-full object-cover"
				/>
			</button>
		{/each}
	</div>
</div>
