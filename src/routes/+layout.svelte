<script>
	import '../app.css';
	import Header from '../lib/client/components/layout/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Photo Parndt</title>
</svelte:head>

{@render children()}
