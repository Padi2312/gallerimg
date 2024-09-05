<script lang="ts">
	import Header from '$lib/client/components/layout/Header.svelte';
	import type { PageData } from './$types';

	type UnsubscribeProps = {
		data: PageData;
	};

	let { data } = $props() as UnsubscribeProps;
</script>

<div class="min-h-screen">
	<Header />
	{#if data.error}
		<div class="flex h-screen items-center justify-center p-4">
			<div class="w-full max-w-lg rounded-lg bg-bg-secondary p-8 text-center shadow-lg">
				<h1 class="mb-4 text-3xl font-semibold text-red-500">Oops! Something Went Wrong</h1>
				<p class="mb-6">
					We're sorry, but an error occurred while processing your request. Please try again later
					or contact our support team for assistance.
				</p>
				<p>Thank you for your understanding.</p>
			</div>
		</div>
	{:else}
		<div class="flex h-screen items-center justify-center p-4">
			<div class="w-full max-w-lg rounded-lg bg-bg-secondary p-8 text-center shadow-lg">
				<h1 class="mb-4 text-3xl font-semibold text-primary">We're Sorry to See You Go</h1>
				<p class="mb-6">
					You've successfully unsubscribed from our newsletter. We're sorry to see you go. If you
					have any questions or need assistance, please feel free to <a
						href="https://photo.parndt.de/contact"
						class="font-bold text-primary hover:underline">contact us</a
					>.
				</p>
				<p>Thank you for being with us.</p>
			</div>
		</div>
	{/if}
</div>
