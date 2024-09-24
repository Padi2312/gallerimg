<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingSpinner from '$lib/client/components/common/LoadingSpinner.svelte';
	import {
		faCheckCircle,
		faExclamationCircle,
		faUpload,
		faX
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let error: string | null = $state(null);
	let isLoading = $state(false);
	let files: File[] = $state([]);
	let dragActive = $state(false);
	let uploadSuccess: boolean | null = $state(null);

	$effect(() => {
		if (uploadSuccess) {
			setTimeout(async () => {
				await goto('/admin/photos');
			}, 1000);
		}
	});

	function handleDrag(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			dragActive = true;
		} else if (e.type === 'dragleave') {
			dragActive = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = false;
		if (e.dataTransfer?.files) {
			const newFiles = Array.from(e.dataTransfer.files);
			files = [...files, ...newFiles];
		}
	}

	function removeFile(file: File) {
		files = files.filter((f) => f !== file);
	}

	const onSubmit = async (e: Event) => {
		e.preventDefault();
		if (files.length > 0) {
			isLoading = true;
			error = null;
			uploadSuccess = null;

			const formData = new FormData();
			files.forEach((file) => formData.append('images', file));
			const response = await fetch('/api/v1/images', {
				method: 'POST',
				body: formData
			});
			isLoading = false;

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					uploadSuccess = true;
					files = [];
				} else {
					error = `Failed to upload files: ${JSON.stringify(data.failedFiles)}`;
					uploadSuccess = false;
				}
			} else {
				error = 'Failed to upload files';
				uploadSuccess = false;
			}
		}
	};

	const onFileChange = (e: Event) => {
		const newFiles = Array.from((e.target as HTMLInputElement)?.files || []);
		files = [...files, ...newFiles];
	};
</script>

{#if uploadSuccess == null}
	<form
		method="POST"
		enctype="multipart/form-data"
		onsubmit={onSubmit}
		class="mx-auto max-w-md rounded-lg bg-bg-secondary p-4 shadow-md"
	>
		{#if isLoading}
			<div class="flex justify-center space-x-2">
				<LoadingSpinner />
				<p class="font-semibold">Uploading...</p>
			</div>
		{:else}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="relative rounded-lg border-2 border-dashed border-border p-8 text-center"
				class:border-primary={dragActive}
				ondragenter={handleDrag}
				ondragleave={handleDrag}
				ondragover={handleDrag}
				ondrop={handleDrop}
			>
				<input
					type="file"
					id="file-upload"
					name="file"
					class="hidden"
					multiple
					onchange={onFileChange}
				/>
				<label
					for="file-upload"
					class="flex cursor-pointer flex-col items-center justify-center space-y-2"
				>
					<Fa icon={faUpload} class="h-12 w-12" />
					<span class="text-lg font-medium">Drag and drop your files here</span>
					<span class="text-text/70 text-sm">or click to select files</span>
				</label>
			</div>

			<button type="submit" class="mt-6 w-full" disabled={files.length === 0}>Upload Files</button>

			{#if files.length > 0}
				<div class="mt-2 flex flex-col space-y-2">
					<span class="font-semibold">{files.length} Files to upload:</span>
					<div class="max-h-96 space-y-2 overflow-y-auto">
						{#each files as file}
							<div class="flex h-full items-center justify-between rounded-md bg-bg p-2">
								<img src={URL.createObjectURL(file)} alt="Preview" class="h-8 w-8" />
								<span class="truncate text-sm">{file.name}</span>
								<button
									type="button"
									class="bg-transparent !p-2 text-text"
									onclick={() => removeFile(file)}
								>
									<Fa icon={faX} />
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</form>
{:else if uploadSuccess}
	<div class="flex h-full flex-col items-center justify-center space-y-2 text-green-600">
		<Fa icon={faCheckCircle} size="4x" />
		<p class="font-medium">Files uploaded successfully!</p>
		<p class="text-sm">You will be redirect in a moment.</p>
	</div>
{:else}
	<div class="flex h-full flex-col items-center justify-center space-y-2 text-red-600">
		<Fa icon={faExclamationCircle} size="4x" />
		<p class="font-medium">{error}</p>
	</div>
{/if}

<style>
	/* Add any additional styles here */
</style>
