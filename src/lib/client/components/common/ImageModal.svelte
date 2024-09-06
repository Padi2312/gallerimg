<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import {
		faClose,
		faExpand,
		faExternalLink,
		faEye,
		faLowVision
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	type ImageModalProps = {
		show?: boolean;
		allowBackdrop?: boolean;
		onClose?: () => void;
		image: ImageDto;
	};
	let { onClose, show = true, allowBackdrop = true, image }: ImageModalProps = $props();
	let isFullResolution = $state(false);
	let imgUrl = $state(image.url + '?width=1000');

	$effect(() => {
		if (isFullResolution) {
			imgUrl = image.url;
		} else {
			imgUrl = image.url + '?width=1000';
		}
	});

	// Close function
	function close() {
		onClose?.();
		show = false;
	}

	// Handle click outside modal to close it
	function handleOutsideClick(event: Event) {
		if (event.target === event.currentTarget && allowBackdrop) {
			close();
		}
	}

	function changeResolution() {
		isFullResolution = !isFullResolution;
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-40 flex items-center justify-center bg-bg-overlay/50 p-0 lg:p-4"
		onclick={handleOutsideClick}
	>
		<div
			class="relative max-h-screen w-auto max-w-full overflow-auto rounded-lg bg-bg p-2 shadow-lg"
		>
			<button class="absolute right-2 top-2 bg-transparent !p-1 text-text" onclick={close}>
				<Fa icon={faClose} />
			</button>
			<div class="flex items-center justify-center">
				{#key imgUrl}
					<img
						src={imgUrl}
						alt={image.title}
						class="h-auto max-h-[80vh] w-auto max-w-full rounded-lg"
					/>
				{/key}
			</div>
			<div class="mt-2 flex space-x-2">
				<button
					class="flex items-center rounded-lg bg-primary !p-1 text-sm"
					onclick={changeResolution}
				>
					{#if isFullResolution}
						<Fa icon={faLowVision} class="mr-2" />
						Low Resolution
					{:else}
						<Fa icon={faEye} class="mr-2" />
						Full Resolution
					{/if}
				</button>
				<a
					href={image.url}
					target="_blank"
					class="flex items-center rounded-lg bg-primary !p-1 text-sm font-medium"
				>
					<Fa icon={faExternalLink} class="mr-2" />
					Open Tab
				</a>
			</div>
		</div>
	</div>
{/if}
