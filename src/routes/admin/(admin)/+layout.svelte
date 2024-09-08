<script>
	import Header from '$lib/client/components/layout/Header.svelte';
	import { signOut } from '@auth/sveltekit/client';
	import {
		faCog,
		faHome,
		faImage,
		faSignOut,
		faTags,
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
					<a
						class="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
						href="/admin/dashboard"
					>
						<Fa icon={faHome} />
						Dashboard
					</a>
					<a
						class="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
						href="/admin/photos/upload"
					>
						<Fa icon={faUpload} />
						Upload</a
					>
					<a
						class="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
						href="/admin/photos"
					>
						<Fa icon={faImage} />
						Photos
					</a>
					<a
						class="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
						href="/admin/tags"
					>
						<Fa icon={faTags} />
						Tags</a
					>
					<a
						class="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
						href="/admin/settings"
					>
						<Fa icon={faCog} />
						Settings</a
					>
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
