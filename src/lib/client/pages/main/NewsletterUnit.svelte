<script lang="ts">
	import LoadingButton from '$lib/client/components/common/LoadingButton.svelte';
	import { emailRegex } from '$lib/shared/utils/utils';
	import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let loading = $state(false);
	let success: null | boolean = $state(null);
	let error: null | string = $state(null);
	let email = $state('');

	const checkEmail = (email: string) => {
		return emailRegex.test(email);
	};

	const onSubmit = async (event: Event) => {
		event.stopPropagation();
		event.preventDefault();

		loading = true;
		if (!checkEmail(email)) {
			loading = false;
			error = 'Invalid email';
			return;
		}

		const response = await fetch('/api/v1/newsletter', {
			method: 'POST',
			body: JSON.stringify({ email })
		});
		success = response.ok;
		loading = false;
	};
</script>

<section class="bg-bg-secondary py-16" id="newsletter">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold text-primary">Newsletter</h2>
		{#if success == null}
			<p class="mb-2 text-lg text-text">
				Subscribe to the newsletter to stay up to date with my latest images.
			</p>
			<p class="mb-8 text-lg text-text">You will receive an email on newly uploaded images.</p>
			<form
				class="flex w-full items-center justify-center space-x-2"
				method="POST"
				onsubmit={onSubmit}
			>
				<input
					type="email"
					placeholder="Enter your email"
					class="w-full max-w-2xl rounded-lg px-4 py-2"
					bind:value={email}
					required
				/>
				<LoadingButton {loading} disabled={!email}>
					<div class="flex items-center space-x-2">
						<Fa icon={faNewspaper} />
						<span>Subscribe</span>
					</div>
				</LoadingButton>
			</form>
			<p class="py-1 text-sm text-red-500">{error}</p>
		{:else if success && success}
			<p class="mt-4 text-green-500">You're now subscribed to the newsletter</p>
		{:else if success && !success}
			<p class="mt-4 text-red-500">Oops something went wrong :/</p>
		{/if}
	</div>
</section>
