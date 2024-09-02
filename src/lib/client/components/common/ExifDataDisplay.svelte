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

	type ExifDataDisplayProps = {
		metadataModel: MetadataModel;
	};
	let { metadataModel }: ExifDataDisplayProps = $props();
	const { exif_data: rawExifValue } = metadataModel;
	const exifData = {
		'Image Info': [
			{ label: 'Image Height', value: rawExifValue['ImageHeight']?.description },
			{ label: 'Image Width', value: rawExifValue['ImageWidth']?.description },
			{ label: 'Color Components', value: rawExifValue['ColorComponents']?.value },
			{ label: 'Subsampling', value: rawExifValue['Subsampling']?.description },
			{ label: 'Color Space', value: rawExifValue['ColorSpace']?.description },
			{ label: 'Pixel X Dimension', value: rawExifValue['PixelXDimension']?.value },
			{ label: 'Pixel Y Dimension', value: rawExifValue['PixelYDimension']?.value }
		],
		'Camera Info': [
			{ label: 'Make', value: rawExifValue['Make']?.description },
			{ label: 'Model', value: rawExifValue['Model']?.description },
			{ label: 'Lens Model', value: rawExifValue['LensModel']?.description },
			{ label: 'Lens Specification', value: rawExifValue['LensSpecification']?.description },
			{ label: 'Camera Owner Name', value: rawExifValue['CameraOwnerName']?.description },
			{ label: 'Body Serial Number', value: rawExifValue['BodySerialNumber']?.description },
			{ label: 'Lens Serial Number', value: rawExifValue['LensSerialNumber']?.description }
		],
		'Capture Info': [
			{ label: 'Date Time', value: rawExifValue['DateTime']?.description },
			{ label: 'Date Time Original', value: rawExifValue['DateTimeOriginal']?.description },
			{ label: 'Date Time Digitized', value: rawExifValue['DateTimeDigitized']?.description },
			{ label: 'Exposure Time', value: rawExifValue['ExposureTime']?.description },
			{ label: 'F Number', value: rawExifValue['FNumber']?.description },
			{ label: 'ISO Speed Ratings', value: rawExifValue['ISOSpeedRatings']?.value },
			{ label: 'Focal Length', value: rawExifValue['FocalLength']?.description },
			{ label: 'Exposure Program', value: rawExifValue['ExposureProgram']?.description },
			{ label: 'Metering Mode', value: rawExifValue['MeteringMode']?.description },
			{ label: 'Flash', value: rawExifValue['Flash']?.description },
			{ label: 'White Balance', value: rawExifValue['WhiteBalance']?.description }
		],
		'File Info': [
			{ label: 'File Type', value: rawExifValue['FileType']?.description },
			{ label: 'Orientation', value: rawExifValue['Orientation']?.description },
			{ label: 'X Resolution', value: rawExifValue['XResolution']?.description },
			{ label: 'Y Resolution', value: rawExifValue['YResolution']?.description },
			{ label: 'Resolution Unit', value: rawExifValue['ResolutionUnit']?.description },
			{ label: 'Copyright', value: rawExifValue['Copyright']?.description },
			{ label: 'Artist', value: rawExifValue['Artist']?.description },
			{ label: 'Rating', value: rawExifValue['Rating']?.value }
		]
	};
	const categoryIcons: Record<string, IconDefinition> = {
		'Image Info': faImage,
		'Camera Info': faCamera,
		'Capture Info': faClock,
		'File Info': faFileAlt
	};

	let expandedCategories = $state<string[]>([]);

	function toggleCategory(category: string) {
		if (expandedCategories.includes(category)) {
			expandedCategories = expandedCategories.filter((c) => c !== category);
		} else {
			expandedCategories = [...expandedCategories, category];
		}
	}

	function getImportantInfo() {
		return [
			{ label: 'Camera', value: rawExifValue['Model']?.description },
			{ label: 'Lens', value: rawExifValue['LensModel']?.description },
			{ label: 'Focal Length', value: rawExifValue['FocalLength']?.description },
			{ label: 'Aperture', value: rawExifValue['FNumber']?.description },
			{ label: 'Shutter Speed', value: rawExifValue['ExposureTime']?.description },
			{ label: 'ISO', value: rawExifValue['ISOSpeedRatings']?.value }
		].filter((item) => item.value);
	}
</script>

<div transition:slide={{ duration: 200 }}>
	<div class="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
		{#each getImportantInfo() as { label, value }}
			<div class="rounded-lg bg-bg-secondary p-2 text-center shadow-sm">
				<span class="text-xs font-semibold text-primary">{label}</span>
				<p class="mt-1 text-sm text-text">{value}</p>
			</div>
		{/each}
	</div>

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
