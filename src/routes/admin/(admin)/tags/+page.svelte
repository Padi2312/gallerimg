<script lang="ts">
	import type { PageData } from './$types';

	let items = $state([
		{ id: 1, tags: ['nature', 'landscape'] },
		{ id: 2, tags: ['urban', 'architecture'] },
		{ id: 3, tags: ['nature', 'wildlife'] },
		{ id: 4, tags: ['urban', 'street'] },
		{ id: 5, tags: ['landscape', 'mountain'] },
		{ id: 6, tags: ['architecture', 'modern'] }
	]);

	type TagsPageProps = {
		data: PageData;
	};
	let { data } = $props();
	let tagLabels = $state(data.tags.map((tag) => tag.name));
	let tags = $state(data.tags);
	// A derived list of all unique tags across items
	let allTags = $state(tags);
	let newTag = $state('');

	// Function to add a new tag to all items (for simplicity)
	function addTag() {
		if (newTag.trim()) {
			items = items.map((item) => ({
				...item,
				tags: item.tags.includes(newTag.trim()) ? item.tags : [...item.tags, newTag.trim()]
			}));
			allTags = Array.from(new Set(items.flatMap((item) => item.tags)));
			newTag = ''; // Reset input after adding
		}
	}

	// Function to remove a tag from all items
	function removeTag(tag: string) {
		items = items.map((item) => ({
			...item,
			tags: item.tags.filter((t) => t !== tag)
		}));
		allTags = Array.from(new Set(items.flatMap((item) => item.tags)));
	}
</script>

<div class="container mx-auto p-4">
	<h2 class="mb-4 text-2xl font-bold">Tag Overview</h2>

	<!-- Add Tag Input -->
	<div class="mb-4 flex gap-2">
		<input type="text" placeholder="Add a tag" bind:value={newTag} class="rounded-md border p-2" />
		<button class="rounded-md bg-primary px-4 py-2 text-white" onclick={addTag}> Add Tag </button>
	</div>

	<!-- Display Tags -->
	<div class="mb-4">
		<h3 class="text-xl font-semibold">All Tags</h3>
		{#each tagLabels as tag}
			<div class="flex items-center justify-between border-b py-2">
				<span>{tag}</span>
				<button class="text-red-500" onclick={() => removeTag(tag)}> Delete </button>
			</div>
		{/each}
	</div>
</div>
