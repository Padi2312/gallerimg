<script lang="ts">
	import type { ImageDto } from '$lib/types';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import Autoplay from 'embla-carousel-autoplay';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Fa from 'svelte-fa';

	type CarouselProps = {
		images: ImageDto[];
	};
	let { images: _images = [] }: CarouselProps = $props();
	const plugins: any = [
		Autoplay({
			delay: 3000,
			stopOnInteraction: true
		})
	];
	let images = $state(_images.slice(0, 5));
	let emblaApi: any | null = $state(null);

	const onInit = (event: CustomEvent<any>) => {
		emblaApi = event.detail;
	};

	const scrollNext = () => {
		emblaApi?.scrollNext();
	};

	const scrollPrev = () => {
		emblaApi?.scrollPrev();
	};
</script>

<div class="embla" use:emblaCarouselSvelte={{ plugins: plugins }} onemblaInit={onInit}>
	<div class="embla__container">
		{#each images as image}
			<img class="embla__slide" src={image.url + '?height=800'} alt={image.title} />
		{/each}
	</div>
	<button class="embla__prev embla__btn" onclick={scrollPrev}>
		<Fa icon={faArrowLeft} />
	</button>
	<button class="embla__next embla__btn" onclick={scrollNext}>
		<Fa icon={faArrowRight} />
	</button>
</div>

<style>
	.embla {
		@apply relative;
		overflow: hidden;
	}
	.embla__container {
		display: flex;
	}
	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
	}
	.embla__btn {
		@apply bg-gray-600/50 text-text hover:bg-gray-400;
	}
	.embla__prev {
		position: absolute;
		top: 50%;
		left: 8px;
	}
	.embla__next {
		position: absolute;
		top: 50%;
		right: 8px;
	}
</style>
