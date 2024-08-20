<script>
	import Header from '$lib/components/Header.svelte';
	import { faCog, faHome, faImage, faTags } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { children } = $props();
	let showSidebar = $state(false);

	const toggleSidebar = () => {
		showSidebar = !showSidebar;
	};
</script>

<div class="flex min-h-screen w-full flex-col bg-muted/40">
	<Header showToggleSidebar={true} {toggleSidebar} />
	<div class="flex flex-1 flex-col lg:flex-row">
		<aside class="hidden border-r border-border bg-muted/40 lg:block" class:hidden={!showSidebar}>
			<div class="flex h-full max-h-screen flex-col gap-2">
				<nav class="grid items-start p-2 px-4 font-medium">
					<a
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
						href="/admin/dashboard"
					>
						<Fa icon={faHome} />
						Dashboard
					</a>
					<a
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
						href="/admin/photos"
					>
						<Fa icon={faImage} />
						Photos
					</a>
					<a
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
						href="/admin/tags"
					>
						<Fa icon={faTags} />
						Tags</a
					>
					<a
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
						href="/admin/settings"
					>
						<Fa icon={faCog} />
						Settings</a
					>
				</nav>
			</div>
		</aside>

		<main class="flex-1 overflow-y-auto p-2 lg:p-4">
			{@render children()}
		</main>
	</div>
</div>
