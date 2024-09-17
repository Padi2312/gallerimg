<script lang="ts">
	import { faBars } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';
	import { slide } from 'svelte/transition';
	import DarkModeToggle from '../common/DarkModeToggle.svelte';

	type HeaderProps = {};
	let {}: HeaderProps = $props();

	let isMenuOpen = $state(false); // State for mobile menu

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="h-16 border-b border-border p-4">
	<div class="mx-auto flex items-center justify-between space-x-2">
		<div class="flex items-center">
			<a href="/">
				<div class="relative flex items-center space-x-2">
					<img src="/favicon.png" alt="Gallerimg" class="h-8 w-8" />
					<h1 class=" text-2xl font-bold">Photo Parndt</h1>
				</div>
			</a>
		</div>

		<!-- Desktop Links -->
		<nav class="hidden space-x-4 md:flex">
			<a href="/" class="hover:underline">Home</a>
			<a href="/gallery" class="hover:underline">Gallery</a>
		</nav>
		<div class="flex items-center space-x-4">
			<!-- Dark Mode Toggle -->
			<div class="float-end">
				<DarkModeToggle />
			</div>

			<!-- Mobile Menu Toggle -->
			<div class="md:hidden">
				<button onclick={toggleMenu} class="!bg-transparent ps-0">
					<Fa icon={faBars} class="text-2xl text-text" />
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Links -->
</header>

{#if isMenuOpen}
	<nav
		transition:slide
		class="absolute z-20 flex h-full w-full flex-col space-y-2 bg-bg/90 p-4 sm:flex md:hidden"
	>
		{#snippet link(url: string, text: string)}
			<a
				href={url}
				class="block border-b border-border p-2 font-semibold hover:underline"
				onclick={toggleMenu}>{text}</a
			>
		{/snippet}
		{@render link('/', 'Home')}
		{@render link('/gallery', 'Gallery')}
	</nav>
{/if}
