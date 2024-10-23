<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import LightboxModal from '../LightboxModal.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';
	import Photo from '../Photo.svelte';

	type GallerySwipeProps = {
		images: ImageDto[];
		selectedImage: ImageDto | null;
		onClose?: () => void;
	};
	let { images, selectedImage, onClose }: GallerySwipeProps = $props();

	let currentIndex = $state(images.findIndex((img) => img.id === selectedImage?.id));
	let isDragging = $state(false);
	let initialX = $state(0);
	let currentX = $state(0);
	let currentTranslateX = $state(0);
	let isLoading = $state(true);
	let previousIndex = $state(0);

	$effect(() => {
		currentTranslateX = -currentIndex * 100;
		previousIndex = currentIndex;
	});

	const navigate = (direction: number) => {
		isLoading = true;
		currentIndex = (currentIndex + direction + images.length) % images.length;
		currentTranslateX = -currentIndex * 100;
	};

	function handleTouchStart(event: TouchEvent) {
		initialX = event.touches[0].clientX;
		currentX = initialX;
		isDragging = true;
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isDragging) return;

		currentX = event.touches[0].clientX;
		const deltaX = currentX - initialX;
		currentTranslateX = -currentIndex * 100 + (deltaX / window.innerWidth) * 100;

		// Determine the visible images to ensure the half-swipe effect
		if (deltaX > 0 && currentIndex > 0) {
			previousIndex = currentIndex - 1;
		} else if (deltaX < 0 && currentIndex < images.length - 1) {
			previousIndex = currentIndex + 1;
		}
	}

	function handleTouchEnd() {
		isDragging = false;
		const deltaX = currentX - initialX;

		if (deltaX > 50 && currentIndex > 0) {
			navigate(-1);
		} else if (deltaX < -50 && currentIndex < images.length - 1) {
			navigate(1);
		} else {
			currentTranslateX = -currentIndex * 100;
		}
	}

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowRight') {
			navigate(1);
		} else if (e.key === 'ArrowLeft') {
			navigate(-1);
		} else if (e.key === 'Escape' && onClose) {
			onClose();
		}
	};

	function handleImageLoad() {
		isLoading = false;
	}
</script>

<svelte:window onkeydown={onKeyDown} />

<LightboxModal {onClose}>
	<div
		class="relative flex w-full max-w-full touch-pan-y items-center justify-center overflow-hidden"
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
	>
		<div
			class="flex transition-transform duration-200 ease-out"
			style="transform: translateX({currentTranslateX}%);"
		>
			{#each images as item, index (item.id)}
				<div class="max-h-screen w-full flex-shrink-0 items-center justify-center">
					{#if index === currentIndex || index === previousIndex}
						{#if index === currentIndex && isLoading}
							<div class="absolute inset-0 flex items-center justify-center">
								<LoadingSpinner />
							</div>
						{/if}
						<img
							src={item.url + '?compress=30'}
							alt={item.title}
							class="relative left-1/2 aspect-auto max-h-full -translate-x-1/2"
							onload={handleImageLoad}
							loading="lazy"
						/>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Previous and next buttons -->
		{#if images.length > 1}
			<button
				onclick={() => navigate(-1)}
				class="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-transparent p-2 text-white"
			>
				<Fa icon={faChevronLeft} size="2x" />
			</button>
			<button
				onclick={() => navigate(1)}
				class="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-transparent p-2 text-white"
			>
				<Fa icon={faChevronRight} size="2x" />
			</button>
		{/if}
	</div>
</LightboxModal>

<style>
	img {
		will-change: transform, opacity;
	}
</style>
