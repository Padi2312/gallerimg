<script lang="ts">
	// import { getSettings, saveSettings } from '$lib/server/settings';
	import Toggle from '$lib/components/common/Toggle.svelte';
	import { writable } from 'svelte/store';
	import type { PageServerData } from './$types';
	import type { SettingsModel } from '$lib/types/database-types';

	type SettingsProps = {
		data: PageServerData;
	};
	let { data }: SettingsProps = $props();

	$effect(() => {
		console.log('data', data);
	});

	let settings = writable({
		indexUnindexedImages: false,
		indexOnUpload: false
	});

	// onMount(async () => {
	// 	const fetchedSettings = await getSettings();
	// 	settings.set(fetchedSettings);
	// });

	const handleSave = async () => {
		const currentSettings = $settings;
		// await saveSettings(currentSettings);
		alert('Settings saved successfully!');
	};
</script>

{#snippet settingItem(setting: SettingsModel)}
	{#if setting.type === 'boolean'}
		<Toggle id={setting.key} bind:checked={setting.value} label={setting.key} />
	{:else if setting.type === 'string'}
		<div class="flex flex-col space-y-1">
			<label for={setting.key}>{setting.key}</label>
			<input type="text" id={setting.key} bind:value={setting.value} />
		</div>
	{:else}
		<p>Unsupported setting type: {setting.type}</p>
	{/if}
{/snippet}

<div class="h-full p-4">
	<h1 class="mb-4 text-2xl font-semibold">Settings</h1>
	<div class="flex flex-col space-y-4">
		{#each data.settings.settings as setting}
			{@render settingItem(setting)}
		{/each}
	</div>
</div>

<style>
	/* Add any additional styles here */
</style>
