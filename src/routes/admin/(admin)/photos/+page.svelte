<script lang="ts">
	import ImageList from '$lib/client/components/admin/ImageList.svelte';
	import type { PageData } from './$types';

	type AdminPhotosPageProps = {
		data: PageData;
	};
	let { data }: AdminPhotosPageProps = $props();
</script>

<div class="h-full">
	<ImageList images={data.images} />
</div>
