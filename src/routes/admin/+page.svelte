<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { signIn } from '@auth/sveltekit/client';

	let username = $state('');
	let password = $state('');
</script>

<Header />
<div class="flex h-screen items-center justify-center">
	<div class="w-full max-w-md rounded-lg shadow-2xl">
		<div class="flex flex-col space-y-1 p-6 text-center">
			<h3 class="whitespace-nowrap text-3xl font-bold tracking-tight">Administration</h3>
			<p class="text-muted-foreground text-sm">
				Enter your email and password to sign in to your account.
			</p>
		</div>
		<div class="space-y-4 p-6">
			<div class="space-y-2">
				<label
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					for="username"
				>
					Username
				</label>
				<input
					class="flex h-10 w-full"
					id="username"
					name="username"
					required
					type="text"
					bind:value={username}
				/>
			</div>
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<label
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						for="password"
					>
						Password
					</label>
				</div>
				<input
					class="flex h-10 w-full"
					id="password"
					name="password"
					required
					type="password"
					bind:value={password}
				/>
			</div>
		</div>
		<div class="flex items-center p-6">
			<button
				class="inline-flex h-10 w-full items-center justify-center whitespace-nowrap text-sm font-medium"
				onclick={async () => await signIn('credentials', { username, password })}
			>
				Sign In
			</button>
		</div>
	</div>
</div>
