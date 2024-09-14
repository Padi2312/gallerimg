<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Image from '../Photo.svelte';
	import LightboxModal from '../LightboxModal.svelte';

	type GallerySwipeProps = {
		images: ImageDto[];
		selectedImage: ImageDto | null;
		onClose?: () => void;
	};
	let { images, selectedImage, onClose }: GallerySwipeProps = $props();

	let currentIndex = images.findIndex((img) => img.id === selectedImage?.id);
	let containerElement: HTMLDivElement | null = null;
	let maxImageWidth = $state(0);
	let currentTranslateX = $state(0);
	let isDragging = $state(false);
	let initialX = 0;
	let currentX = 0;
	let dragThreshold = 100;

	const updateWidth = () => {
		if (containerElement) {
			maxImageWidth = containerElement.clientWidth;
			currentTranslateX = -currentIndex * maxImageWidth;
		}
	};
	$effect(updateWidth);

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
			{#each images as item (item.id)}
				<div class="flex w-full flex-shrink-0 items-center justify-center" style="width: 100%;">
					<Image image={item} showTags />
				</div>
			{/each}
		</div>

		<!-- Previous and next buttons -->
		{#if images.length > 1}
			<button
				onclick={() => navigate(-1)}
				class="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-transparent p-2 text-white"
			>
				<Fa icon={faChevronLeft} size="lg" />
			</button>
			<button
				onclick={() => navigate(1)}
				class="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-transparent p-2 text-white"
			>
				<Fa icon={faChevronRight} size="lg" />
			</button>
		{/if}
	</div>
</LightboxModal>

<style>
</style>
