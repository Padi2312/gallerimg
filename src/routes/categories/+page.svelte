<script lang="ts">
	import { faFolder } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { fade, slide } from 'svelte/transition';

	type CategoryPageProps = {
		data: PageData;
	};
	let { data }: CategoryPageProps = $props();
</script>

<div class="p-4">
	<h1 class="col-span-full mb-4 text-center text-4xl font-bold">Categories</h1>
	<div class="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2 lg:p-12 xl:grid-cols-3">
		{#each data.folders as folder}
			<a
				class="justify-center flex flex-col items-center p-4 shadow-xl hover:scale-[102%]"
				href="/categories/{folder.name}-{folder.id}"
			>
				<span class="mb-2 text-center text-lg font-medium lg:text-2xl">{folder.name}</span>
				{#if folder.images.length > 0}
					<img
						alt={folder.name}
						src={folder.images[0].url + '?width=400'}
						class="h-full w-full rounded-md border-4 border-border object-fill"
					/>
				{:else}
					<Fa icon={faFolder} size="3x" />
				{/if}
			</a>
		{/each}
	</div>
</div>
