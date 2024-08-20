<script lang="ts">
	import { invalidateAll, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import ImageList from '$lib/components/admin/ImageList.svelte';
	import UploadModal from '$lib/components/admin/UploadModal.svelte';
	import { faAdd } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';

	type AdminPhotosPageProps = {
		data: PageData;
	};
	let { data }: AdminPhotosPageProps = $props();

	const onModalClose = async () => {
		history.back();
		await invalidateAll();
	};

	const showUploadModal = () => {
		pushState('#upload', {
			showUploadModal: true
		});
	};
</script>

{#if $page.state.showUploadModal}
	<UploadModal onClose={onModalClose} />
{/if}

<div class="relative h-full">
	<div class="absolute bottom-0 right-0">
		<button class="!rounded-full !p-3 shadow-lg" onclick={showUploadModal}>
			<Fa icon={faAdd} class="text-xl" />
		</button>
	</div>
	<ImageList images={data.images} />
</div>
