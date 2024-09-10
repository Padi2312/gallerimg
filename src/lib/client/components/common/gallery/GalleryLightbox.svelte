<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Image from '../Image.svelte';

	type GalleryLightboxProps = {
		images: ImageDto[];
		selectedImage: ImageDto | null;
		onClose: () => void;
	};
	let { images, onClose, selectedImage }: GalleryLightboxProps = $props();

	let currentIndex = images.findIndex((img) => img.id === selectedImage?.id);
	let maxImageWidth = 0;
	let currentTranslateX = $state(-currentIndex * maxImageWidth);
	let isDragging = $state(false);
	let initialX = 0;
	let currentX = 0;
	let dragThreshold = 100; // Smaller drag threshold for easier swipes

	$effect(() => {
		// Calculate the initial state based on selected image
		maxImageWidth = window.innerWidth;
		// if (images.length > 0) {
		// 	currentIndex = images.findIndex((img) => img.id === selectedImage?.id);
		// 	currentTranslateX = -currentIndex * maxImageWidth;
		// }
	});

	const navigate = (direction: number) => {
		currentIndex = (currentIndex + direction + images.length) % images.length;
		currentTranslateX = -currentIndex * maxImageWidth;
	};

	function handleTouchStart(event: TouchEvent) {
		initialX = event.touches[0].clientX;
		isDragging = true;
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isDragging) return;

		currentX = event.touches[0].clientX;
		const deltaX = currentX - initialX;
		// Translate the image according to swipe movement
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
			// Snap back to the current image
			currentTranslateX = -currentIndex * maxImageWidth;
		}
	}

	function handleOutsideClick(event: Event) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	// Keyboard navigation for better accessibility
	window.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowRight') {
			navigate(1);
		} else if (e.key === 'ArrowLeft') {
			navigate(-1);
		} else if (e.key === 'Escape') {
			onClose();
		}
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- Main Lightbox Container -->
<div
	id="lightbox"
	class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-90"
	onclick={handleOutsideClick}
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
>
	<!-- Image container with smooth swiping -->
	<div class="relative max-h-full max-w-full overflow-hidden">
		<div
			class="flex transition-transform duration-300 ease-in-out"
			style="transform: translateX({currentTranslateX}px);"
		>
			{#each images as item (item.id)}
				<div class="flex w-full flex-shrink-0 items-center justify-center">
					<Image image={item} showTags />
				</div>
			{/each}
		</div>
	</div>

	<!-- Close button -->
	<button onclick={onClose} class="absolute right-4 top-4 p-2">
		<Fa icon={faTimes} size="sm" />
	</button>

	<!-- Previous and next buttons -->
	{#if images.length > 1}
		<button
			onclick={() => navigate(-1)}
			class="absolute left-4 top-1/2 -translate-y-1/2 transform p-2"
		>
			<Fa icon={faChevronLeft} size="lg" />
		</button>
		<button
			onclick={() => navigate(1)}
			class="absolute right-4 top-1/2 -translate-y-1/2 transform p-2"
		>
			<Fa icon={faChevronRight} size="lg" />
		</button>
	{/if}
</div>

<style>
	/* Simple styling for better responsiveness */
	#lightbox {
		touch-action: pan-y; /* Avoid page scrolling during horizontal swipe */
	}
</style>
