<script lang="ts">
	import Tag from './Tag.svelte';
	type TagInputProps = {
		tags: string[];
	};
	let { tags = $bindable([]) }: TagInputProps = $props();
	let newTag = $state('');
	let showDropdown = $state(true);
	let suggestions: string[] = $state([]);
	let filteredSuggestions: string[] = $state([]);
	let selectedIndex = $state(-1);

	$effect(() => {
		fetchAllTags();
	});

	$effect(() => {
		filteredSuggestions = suggestions
			.filter(
				(suggestion) =>
					suggestion.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(suggestion)
			)
			.slice(0, 10); // Limit suggestions to 10 items for better performance
		selectedIndex = -1; // Reset the selected index when the suggestions change
	});

	const fetchAllTags = async () => {
		const response = await fetch('/api/v1/tags');
		if (!response.ok) {
			console.error('Failed to fetch tags');
		} else {
			const data = await response.json();
			suggestions = data.tags.map((tag: { name: string }) => tag.name);
			filteredSuggestions = suggestions;
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case ',':
			case 'Enter':
				e.preventDefault();
				addTag(filteredSuggestions[selectedIndex].toLowerCase() || newTag.toLowerCase());
				break;
			case 'ArrowDown':
				e.preventDefault();
				if (filteredSuggestions.length > 0) {
					selectedIndex = (selectedIndex + 1) % filteredSuggestions.length;
				}
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (filteredSuggestions.length > 0) {
					selectedIndex =
						(selectedIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length;
				}
				break;
			case 'Escape':
			default:
				showDropdown = false;
				break;
		}
	};

	const handleInput = () => {
		showDropdown = newTag.length > 0;
	};

	const handleBlur = () => {
		setTimeout(() => {
			showDropdown = false;
		}, 200);
	};

	const handleOutsideClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest('.tag-input-container')) {
			showDropdown = false;
		}
	};

	const addTag = (tag: string) => {
		if (tag.trim() !== '' && !tags.includes(tag.trim())) {
			tags.push(tag.trim());
			newTag = '';
			showDropdown = false;
		}
	};

	const handleRemoveTag = (index: number) => {
		tags = tags.filter((_, i) => i !== index);
	};

	const handleSuggestionClick = (suggestion: string) => {
		addTag(suggestion);
	};

	document.addEventListener('click', handleOutsideClick);
</script>

<div class="tag-input-container relative flex w-full flex-col space-y-2">
	<input
		type="text"
		placeholder="Add a tag..."
		bind:value={newTag}
		onclick={() => (showDropdown = true)}
		onkeydown={handleKeyDown}
		oninput={handleInput}
		onblur={handleBlur}
		class="min-w-0 flex-1 rounded-md border p-2 lowercase"
	/>
	{#if showDropdown && filteredSuggestions.length > 0}
		<ul class="dropdown">
			{#each filteredSuggestions as suggestion, index}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					class:bg-bg-secondary={selectedIndex === index}
					class="dropdown-item"
					onmousedown={() => handleSuggestionClick(suggestion)}
				>
					{suggestion}
				</li>
			{/each}
		</ul>
	{/if}
	<div class="flex flex-wrap">
		{#each tags as tag, index}
			<Tag onDelete={() => handleRemoveTag(index)}>
				{tag}
			</Tag>
		{/each}
	</div>
</div>

<style lang="postcss">
	.dropdown {
		@apply border-2 border-border bg-bg;
		@apply max-h-60 overflow-y-auto;
		@apply z-10 w-full rounded;
	}

	.dropdown-item {
		@apply cursor-pointer p-2 px-4;
		@apply hover:bg-bg-secondary;
		@apply active:bg-bg-secondary;
	}
</style>
