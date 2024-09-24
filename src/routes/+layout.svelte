<script>
	import '../app.css';
	import ToastList from '../lib/client/components/common/ToastList.svelte';
	import Footer from '../lib/client/components/layout/Footer.svelte';
	import Header from '../lib/client/components/layout/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Photo Parndt</title>
</svelte:head>

<ToastList />

<Header />
<div class="min-h-screen">
	{@render children()}
</div>
<Footer />
