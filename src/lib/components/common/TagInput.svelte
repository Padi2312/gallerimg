<script lang="ts">
	import Tag from './Tag.svelte';
	type TagInputProps = {
		tags: string[];
	};
	let { tags = $bindable() }: TagInputProps = $props();
	let newTag = $state('');
	let showDropdown = $state(true);
	let suggestions: string[] = $state([]);
	let filteredSuggestions: string[] = $state([]);

	$effect(() => {
		fetchAllTags();
	});

	$effect(() => {
		filteredSuggestions = suggestions.filter(
			(suggestion) =>
				suggestion.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(suggestion)
		);
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
		if (e.key === ',' || e.key === 'Enter') {
			e.preventDefault();
			addTag(newTag);
		} else if (e.key === 'Enter' && showDropdown && filteredSuggestions.length > 0) {
			e.preventDefault();
			addTag(filteredSuggestions[0]);
		} else if (e.key === 'Escape' && showDropdown) {
			showDropdown = false;
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
</script>

<div class="relative flex w-full flex-col space-y-2">
	<input
		type="text"
		placeholder="Add a tag..."
		bind:value={newTag}
		onclick={() => (showDropdown = true)}
		onkeydown={handleKeyDown}
		oninput={handleInput}
		onblur={handleBlur}
		class="min-w-0 flex-1"
	/>
	{#if showDropdown && filteredSuggestions.length > 0}
		<ul
			class="absolute left-0 top-full z-10 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-bg text-text shadow-lg"
		>
			{#each filteredSuggestions as suggestion}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					class="cursor-pointer px-4 py-2 hover:bg-bg-secondary"
					onmousedown={() => handleSuggestionClick(suggestion)}
				>
					{suggestion}
				</li>
			{/each}
		</ul>
	{/if}
	<div>
		{#each tags as tag, index}
			<Tag onDelete={() => handleRemoveTag(index)}>
				{tag}
			</Tag>
		{/each}
	</div>
</div>
