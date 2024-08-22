<script>
	import { page } from '$app/stores';
	import { faHome } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-center"
>
	<div class="space-y-6 px-4">
		<div class="relative mx-auto h-40 w-40 animate-pulse rounded-full bg-red-100">
			<div class="absolute inset-0 flex items-center justify-center">
				<span class="text-9xl">😕</span>
			</div>
		</div>
		<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
			{$page.error?.message ?? 'An unexpected error occurred'}
		</h1>
		<p class="mx-auto max-w-lg text-xl text-gray-600"></p>
		<div
			class="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
		>
			<a
				href="/"
				class="inline-flex items-center rounded-md bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
			>
				<Fa icon={faHome} class="mr-2 h-5 w-5" />
				Go back home
			</a>
		</div>
	</div>
</div>

<style>
	/* You can add any additional Svelte-specific styles here if needed */
	:global(.animate-pulse) {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
