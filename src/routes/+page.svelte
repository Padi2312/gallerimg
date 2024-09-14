<script lang="ts">
	import Footer from '$lib/client/components/layout/Footer.svelte';
	import Header from '$lib/client/components/layout/Header.svelte';
	import NewsletterUnit from '$lib/client/pages/main/NewsletterUnit.svelte';
	import type { ImageDto } from '$lib/shared/types/index.js';
	import {
		faArrowRight,
		faDownLong,
		faEnvelope,
		faImages
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { page } from '$app/stores';

	export let data;
	const images: ImageDto[] = data.images;

	const getRandomImages = (count: number) => {
		const uniqueCount = Math.min(count, images.length); // Ensure we don't request more than available
		const shuffledImages = [...images].sort(() => 0.5 - Math.random());
		return shuffledImages.slice(0, uniqueCount);
	};

	const titleImage = getRandomImages(1)[0];
	const featuredImages = getRandomImages(4);
</script>

<svelte:head>
	<title>Welcome to Photo Parndt</title>
	<meta name="description" content="Discover stunning images captured directly from my camera to your screen. Explore the gallery and subscribe to stay updated." />
	<meta name="keywords" content="image gallery, photography, photos, subscribe, newsletter, nature, landscape, animals, images" />
	<meta property="og:title" content="Welcome to Photo Parndt" />
	<meta property="og:description" content="Discover stunning images captured directly from my camera to your screen." />
	<meta property="og:image" content="{titleImage.url}" />
	<meta property="og:url" content="{$page.url.href}" />
	<meta property="og:type" content="website" />
	<!-- Twitter Card tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Welcome to Photo Parndt" />
	<meta name="twitter:description" content="Discover stunning images captured directly from my camera to your screen." />
	<meta name="twitter:image" content="{titleImage.url}" />
	<!-- Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": "Photo Parndt",
			"url": "{$page.url.origin}"
		}
	</script>
</svelte:head>

<div class="min-h-screen">
	<Header />
	<!-- Hero Section -->
	<section
		class="relative overflow-hidden text-center !text-gray-200"
		style="height: calc(100vh - 64px);"
	>
		<img
			src={titleImage.url + '?width=1500' ?? ''}
			alt={titleImage.title || "Landing Illustration"}
			class="absolute inset-0 h-full w-full object-cover"
		/>

		<div class="absolute inset-0 bg-bg-overlay/60"></div>
		<div class="absolute inset-0 flex flex-col items-center justify-center text-center">
			<h1 class="mb-4 text-5xl font-bold">Welcome to Photo Parndt</h1>
			<p class="mb-8 max-w-2xl text-2xl">
				Just some expressions directly from my camera to your screen
			</p>
			<p class="mb-8 max-w-2xl text-lg font-light">
				Scroll down for a little foretaste, subscribe to the newsletter to stay up to date
			</p>
			<div class="flex space-x-4">
				<a href="/gallery" class="btn flex items-center gap-2 text-sm md:text-lg">
					<Fa icon={faImages} size="lg" />
					View All Images
				</a>
				<a href="#newsletter" class="btn flex items-center gap-2 text-sm md:text-lg">
					<Fa icon={faEnvelope} size="lg" />
					Subscribe to Newsletter
				</a>
			</div>
		</div>
		<div class="absolute bottom-4 flex w-full justify-center">
			<Fa icon={faDownLong} class="" size="3x" />
		</div>
	</section>

	<!-- Gallery Preview Section -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<h2 class="mb-8 text-center text-3xl font-bold text-primary">Small Teaser</h2>
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{#each featuredImages as image}
					<div
						class="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
					>
						<img
							src={image.url + '?width=600'}
							alt={image.title || "Gallery Image"}
							class="h-full w-full object-cover"
							loading="lazy"
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
	<NewsletterUnit />
	<!-- Footer Section -->
	<Footer />
</div>
