<script lang="ts">
	import { removeToast, toasts, type ToastData } from '$lib/client/stores/toast-store.svelte';
	import { fade } from 'svelte/transition';
	import Toast from './Toast.svelte';

	let toastList = $state<ToastData[]>([]);
	toasts.subscribe((_toastList) => {
		toastList = _toastList;
	});

	// Handle dismissal from individual toast
	function handleDismiss(id: number) {
		removeToast(id);
	}
</script>

<div class="fixed right-4 top-4 z-50 flex flex-col items-end">
	{#each toastList as toast (toast.id)}
		<div transition:fade={{ duration: 300 }}>
			<Toast {toast} ondismiss={handleDismiss} />
		</div>
	{/each}
</div>
