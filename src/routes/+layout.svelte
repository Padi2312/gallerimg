<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Photo Parndt</title>
</svelte:head>
{@render children()}
