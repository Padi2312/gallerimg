<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import LightboxModal from '../LightboxModal.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	type GallerySwipeProps = {
		images: ImageDto[];
		selectedImage: ImageDto | null;
		onClose?: () => void;
	};
	let { images, selectedImage, onClose }: GallerySwipeProps = $props();

	let currentIndex = $state(images.findIndex((img) => img.id === selectedImage?.id));
	let containerElement: HTMLDivElement | null = $state(null);
	let maxImageWidth = $state(0);
	let currentTranslateX = $state(0);
	let isDragging = $state(false);
	let initialX = $state(0);
	let currentX = $state(0);

	let currentImageElement: HTMLImageElement | null = $state(null);

	let isLoading = $state(true); // State to manage loading status

	let dragThreshold = 50;

	const updateWidth = () => {
		if (containerElement) {
			maxImageWidth = containerElement.clientWidth;
			currentTranslateX = -currentIndex * maxImageWidth;
		}
	};
	$effect(updateWidth);

	const navigate = (direction: number) => {
		isLoading = true;
		currentIndex = (currentIndex + direction + images.length) % images.length;
		currentTranslateX = -currentIndex * maxImageWidth;
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
		currentTranslateX = -currentIndex * maxImageWidth + deltaX;
	}

	function handleTouchEnd() {
		isDragging = false;
		const deltaX = currentX - initialX;

		if (deltaX > dragThreshold && currentIndex > 0) {
			navigate(-1); // Swipe left
		} else if (deltaX < -dragThreshold && currentIndex < images.length - 1) {
			navigate(1); // Swipe right
		} else {
			currentTranslateX = -currentIndex * maxImageWidth;
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

	// When the image finishes loading, hide the loading spinner
	function handleImageLoad() {
		isLoading = false;
	}
</script>

<svelte:window onkeydown={onKeyDown} onresize={updateWidth} />

<LightboxModal {onClose}>
	<div
		bind:this={containerElement}
		class="relative flex w-full max-w-full touch-pan-y items-center justify-center overflow-hidden"
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
	>
		<div
			class="flex transition-transform duration-300 ease-out will-change-transform"
			style="transform: translateX({currentTranslateX}px);"
		>
			{#each images as item, index (item.id)}
				<div
					class="w-full flex-shrink-0 items-center justify-center"
					style="transform: translateX({(index - currentIndex) * 100}%);"
				>
					{#if index === currentIndex}
						{#if isLoading}
							<div class="absolute inset-0 flex items-center justify-center">
								<LoadingSpinner />
							</div>
						{/if}
						<img
							bind:this={currentImageElement}
							src={item.url + "?compress=50"}
							alt={item.title}
							class="relative left-1/2 aspect-auto xl:max-h-[90%] -translate-x-1/2"
							onload={handleImageLoad}
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
</style>
