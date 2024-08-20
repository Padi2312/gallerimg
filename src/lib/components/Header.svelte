<script lang="ts">
	import { faBars, faImage } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';
	import DarkModeToggle from './common/DarkModeToggle.svelte';

	type HeaderProps = {
		showToggleSidebar?: boolean;
		toggleSidebar?: () => void;
	};
	let { showToggleSidebar = false, toggleSidebar }: HeaderProps = $props();
</script>

<header class="h-16 border-b border-border p-2 pb-4 lg:p-4">
	<div class="mx-auto flex items-center justify-between space-x-2">
		<div class="flex items-center">
			{#if showToggleSidebar}
				<div class="lg:hidden">
					<button onclick={toggleSidebar} class="!bg-transparent ps-0">
						<Fa icon={faBars} class="text-2xl" />
					</button>
				</div>
			{/if}
			<a href="/">
				<div class="relative flex items-center space-x-2">
					<Fa icon={faImage} class="text-2xl" />
					<h1 class=" text-2xl font-bold">Gallerimg</h1>

					<p class="absolute -bottom-3 right-4 text-xs">by parndt</p>
				</div>
			</a>
		</div>
		<div class="float-end">
			<DarkModeToggle />
		</div>
	</div>
</header>
