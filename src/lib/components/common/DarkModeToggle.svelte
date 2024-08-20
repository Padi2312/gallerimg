<script lang="ts">
	import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	const darkModeStore = writable(true);

	$effect(() => {
		if (localStorage.getItem('theme') === null) {
			localStorage.setItem('theme', 'dark');
		}
		const theme = localStorage.getItem('theme');
		if (theme === 'dark') {
			setDarkMode();
		} else {
			setLightMode();
		}
	});

	const setDarkMode = () => {
		darkModeStore.set(true);
		document.documentElement.classList.add('dark');
		document.documentElement.classList.remove('light');
		localStorage.setItem('theme', 'dark');
	};

	const setLightMode = () => {
		darkModeStore.set(false);
		document.documentElement.classList.add('light');
		document.documentElement.classList.remove('dark');
		localStorage.setItem('theme', 'light');
	};

	const toggle = () => {
		if ($darkModeStore) {
			setLightMode();
		} else {
			setDarkMode();
		}
	};
</script>

<button
	class="relative h-6 w-12 rounded-full {$darkModeStore
		? '!bg-slate-600'
		: '!bg-slate-300'} transition-colors duration-200 focus:outline-none"
	class:bg-gray-700={$darkModeStore}
	class:bg-gray-300={!$darkModeStore}
	onclick={toggle}
>
	<span
		class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200"
		class:translate-x-6={$darkModeStore}
	>
		{#if $darkModeStore}
			<Fa icon={faMoon} class="ml-0.5 mt-0.5 h-4 w-4 text-gray-700" />
		{:else}
			<Fa icon={faSun} class="ml-0.5 mt-0.5 h-4 w-4 text-yellow-500" />
		{/if}
	</span>
</button>

<style>
	:global(.dark) {
		--tw-bg-opacity: 1;
		background-color: rgba(31, 41, 55, var(--tw-bg-opacity)); /* bg-gray-800 */
	}
	:global(.light) {
		--tw-bg-opacity: 1;
		background-color: rgba(229, 231, 235, var(--tw-bg-opacity)); /* bg-gray-200 */
	}
</style>

