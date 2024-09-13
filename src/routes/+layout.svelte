<script>
	import '../app.css';
	import ToastList from '../lib/client/components/common/ToastList.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Photo Parndt</title>
</svelte:head>

<ToastList />

{@render children()}
