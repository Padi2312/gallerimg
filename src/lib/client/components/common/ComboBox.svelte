<script lang="ts">
	type ComboboxProps = {
		suggestions: string[];
		placeholder?: string;
		maxSuggestions?: number;
	};

	let {
		suggestions = $bindable([]),
		placeholder = 'Type to search...',
		maxSuggestions = 10
	}: ComboboxProps = $props();

	let inputValue = $state('');
	let showDropdown = $state(true);
	let filteredSuggestions: string[] = $state([]);
	let selectedIndex = $state(-1);

	// Filter suggestions based on input
	$effect(() => {
		filteredSuggestions = suggestions
			.filter((suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()))
			.slice(0, maxSuggestions);
		selectedIndex = -1; // Reset the selected index when suggestions change
	});

	// Handle key interactions for dropdown navigation and selection
	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'Enter':
				e.preventDefault();
				if (filteredSuggestions[selectedIndex]) {
					selectItem(filteredSuggestions[selectedIndex].toLowerCase());
				} else if (inputValue) {
					selectItem(inputValue.toLowerCase());
				}
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
				showDropdown = false;
				break;
			default:
				showDropdown = true;
				break;
		}
	};

	// Handle the addition of a new item (tag/selection)
	const selectItem = (item: string) => {
		inputValue = item.trim(); // Reset input value after selection
		showDropdown = false; // Close dropdown after selection
	};

	// Handle input change and toggle dropdown
	const handleInput = () => {
		showDropdown = inputValue.length > 0;
	};

	// Close dropdown when clicking outside
	const handleOutsideClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest('.combobox-container')) {
			showDropdown = false;
		}
	};

	document.addEventListener('click', handleOutsideClick);
</script>

<div class="combobox-container relative flex w-full flex-col space-y-0">
	<input
		type="text"
		{placeholder}
		bind:value={inputValue}
		onkeydown={handleKeyDown}
		oninput={handleInput}
		class="min-w-0 flex-1 rounded-none p-2 focus:outline-none focus:ring-0"
	/>

	{#if showDropdown && filteredSuggestions.length > 0}
		<ul class="dropdown">
			{#each filteredSuggestions as suggestion, index}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					class:bg-bg-secondary={selectedIndex === index}
					class="dropdown-item"
					onmousedown={() => selectItem(suggestion)}
				>
					{suggestion}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="postcss">
	.dropdown {
		@apply border border-border bg-bg shadow;
		@apply max-h-60 overflow-y-auto;
		@apply z-10 w-full rounded-b rounded-e rounded-s;
	}

	.dropdown-item {
		@apply cursor-pointer p-2 px-4;
		@apply hover:bg-bg-secondary;
		@apply active:bg-bg-secondary;
	}

	.tag {
		@apply mb-2 mr-2 rounded-full bg-indigo-600 px-3 py-1 text-white;
		@apply flex items-center;
	}

	.tag button {
		@apply ml-2 text-red-400;
	}
</style>
