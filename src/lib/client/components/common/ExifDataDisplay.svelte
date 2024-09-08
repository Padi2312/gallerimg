<script lang="ts">
	import type { MetadataModel } from '$lib/server/types/database-types';
	import {
		faCamera,
		faChevronDown,
		faChevronUp,
		faClock,
		faFileAlt,
		faImage,
		type IconDefinition
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { slide } from 'svelte/transition';

	// Props for the component
	type ExifDataDisplayProps = {
		metadataModel: MetadataModel;
	};
	let { metadataModel }: ExifDataDisplayProps = $props();

	// exifData object now references metadataModel directly
	const exifData = {
		'Capture Info': [
			{ label: 'Date Time Original', value: metadataModel.date_time_original },
			{ label: 'Exposure Time', value: metadataModel.exposure_time },
			{ label: 'Aperture (F Number)', value: metadataModel.f_number },
			{ label: 'ISO Speed', value: metadataModel.iso?.toString() },
			{ label: 'Focal Length', value: metadataModel.focal_length },
			{ label: 'Flash Used', value: metadataModel.flash ? 'Yes' : 'No' },
			{ label: 'Exposure Bias', value: metadataModel.exposure_bias?.toString() }
		],
		'Camera Info': [
			{ label: 'Camera Model', value: metadataModel.model },
			{ label: 'Lens Model', value: metadataModel.lens_model }
		]
	};

	// Category icons
	const categoryIcons: Record<string, IconDefinition> = {
		'Capture Info': faClock,
		'Camera Info': faCamera
	};

	// Expanded categories state
	let expandedCategories = $state<string[]>([]);

	// Toggle expanded categories
	function toggleCategory(category: string) {
		if (expandedCategories.includes(category)) {
			expandedCategories = expandedCategories.filter((c) => c !== category);
		} else {
			expandedCategories = [...expandedCategories, category];
		}
	}

	// Get important information for display at the top
	function getImportantInfo() {
		return [
			{ label: 'Camera', value: metadataModel.model },
			{ label: 'Lens', value: metadataModel.lens_model },
			{ label: 'Focal Length', value: metadataModel.focal_length },
			{ label: 'Aperture', value: metadataModel.f_number },
			{ label: 'Shutter Speed', value: metadataModel.exposure_time },
			{ label: 'ISO', value: metadataModel.iso?.toString() }
		].filter((item) => item.value);
	}
</script>

<div transition:slide={{ duration: 200 }}>
	<!-- Important information grid -->
	<div class="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
		{#each getImportantInfo() as { label, value }}
			<div class="rounded-lg bg-bg-secondary p-2 text-center shadow-sm">
				<span class="text-xs font-semibold text-primary">{label}</span>
				<p class="mt-1 text-sm text-text">{value}</p>
			</div>
		{/each}
	</div>

	<!-- Detailed EXIF data with collapsible sections -->
	{#each Object.entries(exifData) as [category, items]}
		<div class="mb-2">
			<button
				onclick={() => toggleCategory(category)}
				class="flex w-full items-center justify-between rounded-lg bg-primary p-2 text-left text-sm font-semibold"
			>
				<div class="flex items-center space-x-2">
					<Fa icon={categoryIcons[category]} size="sm" />
					<span>{category}</span>
				</div>
				<Fa icon={expandedCategories.includes(category) ? faChevronUp : faChevronDown} size="sm" />
			</button>
			{#if expandedCategories.includes(category)}
				<div
					transition:slide={{ duration: 200 }}
					class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
				>
					{#each items as { label, value }}
						{#if value}
							<div class="rounded-lg bg-bg-secondary p-2">
								<span class="text-xs font-semibold text-primary">{label}:</span>
								<p class="mt-1 text-sm text-text">{value}</p>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
</style>
