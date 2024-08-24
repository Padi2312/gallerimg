<script lang="ts">
	import Tag from './Tag.svelte';

	type TagInputProps = {
		tags: string[];
	};
	let { tags = $bindable() }: TagInputProps = $props();
	let newTag = $state('');

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === ',') {
			e.preventDefault();
			if (newTag.trim() !== '') {
				tags.push(newTag.trim());
				newTag = '';
			}
		}
	}

	function handleRemoveTag(index: number) {
		tags.splice(index, 1);
	}
</script>

<div class="flex w-full flex-col space-y-2">
	<input
		type="text"
		placeholder="Add a tag..."
		bind:value={newTag}
		onkeydown={handleKeyDown}
		class="min-w-0 flex-1"
	/>
	<div>
		{#each tags as tag, index}
			<Tag onDelete={() => handleRemoveTag(index)}>
				{tag}
			</Tag>
		{/each}
	</div>
</div>
