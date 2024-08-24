<script lang="ts">
	import type { ImageDto } from '$lib/types';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import Autoplay from 'embla-carousel-autoplay';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Fa from 'svelte-fa';
	import Image from './Image.svelte';

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

<div
	class="embla"
	use:emblaCarouselSvelte={{ options: { loop: true }, plugins: plugins }}
	onemblaInit={onInit}
>
	<div class="embla__container">
		{#each images as image}
			<div class="embla__slide">
				<Image {image} height={800} />
			</div>
		{/each}
	</div>
	<button class="embla__prev embla__btn" onclick={scrollPrev}>
		<Fa icon={faArrowLeft} />
	</button>
	<button class="embla__next embla__btn" onclick={scrollNext}>
		<Fa icon={faArrowRight} />
	</button>
</div>

<style lang="postcss">
	.embla {
		@apply relative max-w-full overflow-hidden;
	}
	.embla__container {
		@apply flex max-w-full;
	}
	.embla__slide {
		@apply object-contain;
		@apply flex items-center justify-center;
		@apply min-h-96;
		flex: 0 0 100%;
		min-width: 0;
	}
	.embla__btn {
		@apply z-10 bg-gray-600/50 text-text hover:bg-gray-400;
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
