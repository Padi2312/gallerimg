<script lang="ts">
	import { faFolder } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';

	type CategoryPageProps = {
		data: PageData;
	};
	let { data }: CategoryPageProps = $props();
</script>

<div class="p-4">
	<h1 class="col-span-full mb-4 text-center text-4xl font-bold">Categories</h1>
	<div class="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-2 lg:p-12 xl:grid-cols-3">
		{#each data.folders as folder}
			<a
				class="justify-cente flex flex-col items-center hover:scale-105"
				href="/categories/{folder.name}-{folder.id}"
			>
				{#if folder.images.length > 0}
					<div class="rounded-full">
						<img
							alt={folder.name}
							src={folder.images[0].url + '?width=400'}
							class="h-full w-full rounded object-fill"
						/>
					</div>
				{:else}
					<Fa icon={faFolder} size="3x" />
				{/if}
				<span class="text-center text-xl font-light">{folder.name}</span>
			</a>
		{/each}
	</div>
</div>
