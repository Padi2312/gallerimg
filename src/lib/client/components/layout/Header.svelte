<script lang="ts">
	import { page } from '$app/stores';
	import { faBars } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';
	import DarkModeToggle from '../common/DarkModeToggle.svelte';

	type HeaderProps = {
		showToggleSidebar?: boolean;
		toggleSidebar?: () => void;
	};
	let { showToggleSidebar = false, toggleSidebar }: HeaderProps = $props();

	let isHomeUrl = $state(true);

	$effect(() => {
		$page.url.pathname === '/' ? (isHomeUrl = true) : (isHomeUrl = false);
	});
</script>

<header class="h-16 border-b border-border p-4">
	<div class="mx-auto flex items-center justify-between space-x-2">
		<div class="flex items-center">
			{#if showToggleSidebar}
				<div class="lg:hidden">
					<button onclick={toggleSidebar} class="!bg-transparent ps-0">
						<Fa icon={faBars} class="text-2xl text-text" />
					</button>
				</div>
			{/if}
			<a href="/">
				<div class="relative flex items-center space-x-2">
					<img src="/favicon.png" alt="Gallerimg" class="h-8 w-8" />
					<h1 class=" text-2xl font-bold">Photo Parndt</h1>

					<!-- <p class="absolute -bottom-3 right-4 text-xs">by parndt</p> -->
				</div>
			</a>
			<a href={isHomeUrl ? '/gallery' : '/'} class="ms-6 hover:underline">
				<p class="">{isHomeUrl ? 'Gallery' : 'Home'}</p>
			</a>
		</div>
		<div class="float-end">
			<DarkModeToggle />
		</div>
	</div>
</header>
