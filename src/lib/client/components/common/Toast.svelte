<script lang="ts">
	import type { ToastData } from '$lib/client/stores/toast-store.svelte';
	import { faTimes } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	type ToastProps = {
		toast: ToastData;
		ondismiss: (id: number) => void;
	};
	let { toast, ondismiss }: ToastProps = $props();
</script>

<div
	class={`toast ${toast.type} show mb-4 flex translate-x-full 
    transform items-center justify-between
     rounded-lg p-4 text-white opacity-0 shadow-lg transition-all duration-500 ease-in-out ${toast.type === 'info' ? 'bg-blue-500' : toast.type === 'warn' ? 'bg-yellow-500' : toast.type === 'error' ? 'bg-red-500' : ''}`}
>
	<div class="message mr-4 flex-1">{toast.message}</div>
	<button class="bg-bg-secondary p-2" onclick={() => ondismiss(toast.id)}>
		<Fa icon={faTimes} size="xs" />
	</button>
</div>

<style lang="postcss">
	.toast {
		@apply fixed right-4 top-4 z-50 min-w-[250px] max-w-[400px] rounded-lg shadow-lg;
	}

	.toast.show {
		opacity: 1;
		transform: translateX(0);
	}

	.toast.info {
		@apply bg-primary; /* Tailwind CSS blue-500 */
	}

	.toast.warn {
		@apply bg-yellow-500;
	}

	.toast.error {
		@apply bg-red-500;
	}

	.close-button {
		padding: 0 0.5rem;
	}

	.close-button:hover {
		color: #d1d5db; /* Tailwind CSS gray-300 */
	}
</style>
