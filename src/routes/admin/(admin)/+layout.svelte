<script>
	import Header from '$lib/client/components/layout/Header.svelte';
	import { signOut } from '@auth/sveltekit/client';
	import {
		faCog,
		faHome,
		faImage,
		faSignOut,
		faTags,
		faFolder,
		faUpload
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { children } = $props();
	let showSidebar = $state(false);

	const toggleSidebar = () => {
		showSidebar = !showSidebar;
	};
</script>

<div class="bg-muted/40 flex min-h-screen w-full flex-col">
	<Header showToggleSidebar={true} {toggleSidebar} />
	<div class="flex flex-1 flex-col lg:flex-row">
		<aside class="bg-muted/40 hidden border-r border-border lg:block" class:hidden={!showSidebar}>
			<div class="flex h-full max-h-screen flex-col gap-2">
				<nav class="grid items-start p-2 px-4 font-medium">
					{#snippet navItem(
						/** @type {string} */ href,
						/** @type {import("@fortawesome/fontawesome-common-types").IconDefinition} */ icon,
						/** @type {string} */ text
					)}
						<a
							class="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
							{href}
							onclick={toggleSidebar}
						>
							<Fa {icon} />
							{text}
						</a>
					{/snippet}
					{@render navItem('/admin/dashboard', faHome, 'Dashboard')}
					{@render navItem('/admin/photos', faImage, 'Photos')}
					{@render navItem('/admin/upload', faUpload, 'Upload')}
					{@render navItem('/admin/folders', faFolder, 'Folders')}
					{@render navItem('/admin/tags', faTags, 'Tags')}
					{@render navItem('/admin/settings', faCog, 'Settings')}

					<button
						class="text-muted-foreground mt-4 flex items-center gap-3 rounded-lg bg-transparent px-3 py-2 transition-all hover:text-primary"
						onclick={() => signOut({ callbackUrl: '/' })}
					>
						<Fa icon={faSignOut} />
						Logout</button
					>
				</nav>
			</div>
		</aside>

		<main class="flex-1 overflow-y-auto p-2 lg:p-4">
			{@render children()}
		</main>
	</div>
</div>
