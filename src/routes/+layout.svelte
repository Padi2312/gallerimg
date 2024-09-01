<script>
	import '../app.css';
	import Header from '../lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Photo Parndt</title>
</svelte:head>

<Header />
{@render children()}
