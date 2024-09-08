<script lang="ts">
	import type { ImageDto } from '$lib/shared/types';
	import Image from '$lib/client/components/common/Image.svelte';
	import type { TagModel } from '$lib/server/types/database-types';
	import Tag from './Tag.svelte';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	type GalleryProps = {
		images: ImageDto[];
		tags: TagModel[];
	};
	let { images, tags: tagList }: GalleryProps = $props();
	let tags = $state([...tagList]);
	let selectedTags: TagModel[] = $state([]);
	let filteredItems = $derived(
		selectedTags.length > 0
			? images.filter((item) => {
					const imgTags = item.tags;
					const selectedTagsNames = selectedTags.map((tag) => tag.name);
					return selectedTagsNames.some((tag) => imgTags.includes(tag));
				})
			: images
	);
</script>

<div class="container mx-auto p-4">
	<div class="mb-4 flex flex-wrap gap-2">
		<button
			class="py-0 transition-colors {selectedTags
				? 'border-2 border-border bg-transparent'
				: 'text-secondary-foreground bg-secondary'}"
			onclick={() => (selectedTags = [])}
		>
			All
		</button>
		<div>
			{#each tags as tag}
				<Tag
					isActive={selectedTags.includes(tag)}
					onClick={() => {
						if (selectedTags.includes(tag)) {
							selectedTags = selectedTags.filter((t) => t !== tag);
						} else {
							selectedTags = [...selectedTags, tag];
						}
					}}
				>
					{tag.name}
				</Tag>
			{/each}
		</div>
	</div>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each filteredItems as item (item.id)}
			<div transition:fade={{ duration: 300 }} animate:flip={{ duration: 300 }}>
				<Image image={item} width={400} showTags displayActions />
			</div>
		{/each}
	</div>
</div>
