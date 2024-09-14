<script lang="ts">
	import DropdownItem from '$lib/client/components/common/DropdownItem.svelte';
	import DropdownV2 from '$lib/client/components/common/DropdownV2.svelte';
	import type { FolderDto } from '$lib/shared/types';
	import { faEllipsisV, faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';

	type FolderProps = {
		folder: FolderDto;
		onOpenClick: (folder: FolderDto) => void;
		onAddClick: (folder: FolderDto) => void;
		onRename: (folder: { id: string; name: string }) => void;
	};
	let { folder, onAddClick, onOpenClick, onRename }: FolderProps = $props();
	let name = $state(folder.name);
	let isRenaming = $state(false);
	let showActions = $state(false);

	let inputRef: HTMLInputElement | null = $state(null);

	$effect(() => {
		if (isRenaming) {
			inputRef?.focus();
		}
	});

	const enableRenaming = () => {
		isRenaming = true;
	};

	const onClickAddImages = () => {
		onAddClick(folder);
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="relative flex cursor-pointer flex-col justify-items-center rounded-md border border-border bg-bg-secondary p-4 text-center"
	onclick={() => onOpenClick(folder)}
>
	<button
		class="absolute right-2 top-2 bg-transparent p-2"
		onclick={(e) => {
			e.stopImmediatePropagation();
			e.preventDefault();
			showActions = !showActions;
		}}
	>
		<Fa icon={faEllipsisV} />
	</button>
	{#if showActions}
		<DropdownV2 onclose={() => (showActions = false)}>
			<DropdownItem onClick={onClickAddImages}>Add Images</DropdownItem>
			<DropdownItem onClick={enableRenaming}>Rename</DropdownItem>
			<DropdownItem onClick={() => {}}>Delete</DropdownItem>
		</DropdownV2>
	{/if}

	<!-- Folder icon -->
	<div class="flex items-center justify-center">
		<Fa icon={folder.images.length > 0 ? faFolderOpen : faFolder} class="text-6xl text-primary" />
	</div>

	{#if !isRenaming}
		<span class="block font-semibold">{folder.name}</span>
	{:else}
		<!-- svelte-ignore a11y_autofocus -->
		<input
			bind:this={inputRef}
			type="text"
			class="mt-2"
			bind:value={name}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					onRename({ id: folder.id, name: name });
					isRenaming = false;
				}
			}}
			onblur={() => (isRenaming = false)}
		/>
	{/if}
</div>

<style>
</style>
