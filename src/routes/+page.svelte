<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import type { ImageDto } from '$lib/types';
	import {
		faArrowRight,
		faDownLong,
		faImages,
		faNewspaper
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Header from '../lib/components/Header.svelte';

	let { data } = $props();
	const images: ImageDto[] = data.images;

	const getRandomImages = (count: number) => {
		const uniqueCount = Math.min(count, images.length); // Ensure we don't request more than available
		const shuffledImages = [...images].sort(() => 0.5 - Math.random());
		return shuffledImages.slice(0, uniqueCount);
	};

	const titleImage = getRandomImages(1)[0];
	const featuredImages = getRandomImages(4);

	let scrolled = $state(false);
	const handleScroll = () => {
		if (!scrolled) {
			const screenHeight = window.innerHeight;
			window.scrollBy({ top: screenHeight, behavior: 'smooth' });
			scrolled = true;
		}
	};
</script>

<svelte:window onscroll={handleScroll} />
<div class="min-h-screen">
	<Header />
	<!-- Hero Section -->
	<section class="relative overflow-hidden !text-gray-200" style="height: calc(100vh - 64px);">
		<img
			src={titleImage.url + '?width=1500' ?? ''}
			alt="Landing Illustration"
			class="absolute inset-0 h-full w-full object-cover"
		/>

		<div class="bg-bg-overlay/60 absolute inset-0"></div>
		<div class="absolute inset-0 flex flex-col items-center justify-center text-center">
			<h1 class="mb-4 text-5xl font-bold">Welcome to my Image Gallery</h1>
			<p class="mb-8 max-w-2xl text-2xl">
				Just some expressions directly from my camera to your screen
			</p>
			<p class="mb-8 max-w-2xl text-lg font-light">
				Scroll down for a little foretaste, subscribe the newsletter to stay up to date
			</p>
			<a href="/gallery" class="btn flex items-center gap-2 text-lg">
				Shortcut to Gallery
				<Fa icon={faImages} class="h-5 w-5" />
			</a>
		</div>
		<Fa icon={faDownLong} class="absolute bottom-4 right-1/2 animate-bounce text-5xl" />
	</section>

	<!-- Gallery Preview Section -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<h2 class="mb-8 text-center text-3xl font-bold text-primary">Little foretaste</h2>
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{#each featuredImages as image}
					<div
						class="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
					>
						<img
							src={image.url + '?width=600'}
							alt={image.title}
							class="h-full w-full object-cover"
						/>
					</div>
				{/each}
			</div>
			<div class="mt-12 text-center">
				<a href="/gallery" class="btn inline-flex items-center gap-2 text-lg">
					View All Images
					<Fa icon={faArrowRight} class="h-5 w-5 text-text" />
				</a>
			</div>
		</div>
	</section>

	<!-- Call to Action Section -->
	<section class="bg-bg-secondary py-16">
		<div class="container mx-auto px-4 text-center">
			<h2 class="mb-4 text-3xl font-bold text-primary">Newsletter</h2>
			<p class="mb-2 text-lg text-text">
				Subscribe to the newsletter to stay up to date with my latest images.
			</p>
			<p class="mb-8 text-lg text-text">You will receive an email on newly uploaded images.</p>
			<div class="flex w-full items-center justify-center space-x-2">
				<input
					type="email"
					placeholder="Enter your email"
					class="w-full max-w-2xl rounded-lg px-4 py-2"
				/>
				<button class="flex items-center space-x-2">
					<Fa icon={faNewspaper} />
					<span>Subscribe</span>
				</button>
			</div>
		</div>
	</section>

	<!-- Footer Section -->
	<Footer />
</div>
