<script lang="ts">
	import { faBars, faThumbTack } from '@fortawesome/free-solid-svg-icons';
	import { Fa } from 'svelte-fa';
	import { slide } from 'svelte/transition';
	import DarkModeToggle from '../common/DarkModeToggle.svelte';
	import { page } from '$app/stores';

	type HeaderProps = {};
	let {}: HeaderProps = $props();

	let isMenuOpen = $state(false); // State for mobile menu
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header
	class="flex h-12 w-full items-center justify-between border-b border-border px-2 md:h-16 md:px-8 lg:px-12 xl:px-20"
>
	<div class="flex items-center space-x-10">
		<a href="/">
			<div class="relative flex items-center space-x-2 p-2">
				<img src="/favicon.png" alt="Gallerimg" class="h-8 w-8" />
				<h1 class="text-xl font-bold md:text-2xl">Photo Parndt</h1>
			</div>
		</a>
		<!-- Desktop Links -->
		<nav class="hidden space-x-10 md:flex">
			{#snippet link(href: string, text: string)}
				<a {href} class="flex items-center justify-center space-x-[4px] hover:underline">
					{#if $page.url.pathname === href}
						<Fa icon={faThumbTack} size="sm" class="-rotate-[50deg]" color="#AA0000" />
					{/if}
					<span>{text}</span>
				</a>
			{/snippet}
			{@render link('/', 'Home')}
			{@render link('/gallery', 'Gallery')}
			{@render link('/categories', 'Categories')}
		</nav>
	</div>

	<div class="flex items-center space-x-4">
		<!-- Dark Mode Toggle -->
		<div class="float-end">
			<DarkModeToggle />
		</div>

		<!-- Mobile Menu Toggle -->
		<div class="md:hidden">
			<button onclick={toggleMenu} class="!bg-transparent ps-0 hover:!bg-transparent">
				<Fa icon={faBars} class="text-2xl text-text" />
			</button>
		</div>
	</div>
</header>
{#if isMenuOpen}
	<nav
		transition:slide
		class="absolute z-20 flex h-full w-full flex-col space-y-2 bg-bg/90 p-4 sm:flex md:hidden"
	>
		{#snippet link(url: string, text: string)}
			<a
				href={url}
				class="flex items-center space-x-1 border-b border-border p-2 font-semibold hover:underline"
				onclick={toggleMenu}
			>
				{#if $page.url.pathname === url}
					<Fa icon={faThumbTack} size="sm" class="-rotate-[50deg]" color="#AA0000" />
				{/if}
				<span>
					{text}
				</span>
			</a>
		{/snippet}
		{@render link('/', 'Home')}
		{@render link('/gallery', 'Gallery')}
		{@render link('/categories', 'Categories')}
	</nav>
{/if}
<!-- Mobile Links -->
