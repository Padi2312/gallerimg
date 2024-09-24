<script>
	import Footer from '../../lib/client/components/layout/Footer.svelte';
	import Header from '../../lib/client/components/layout/Header.svelte';
</script>

<Header />
<div class="min-h-screen bg-bg text-text">
	<header class="bg-bg-secondary py-6">
		<div class="container mx-auto px-4">
			<h1 class="text-3xl font-bold">Imprint</h1>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">1. Responsible for the Content</h2>
			<p class="mb-4">
				The person responsible for the content of this website according to § 5 TMG is:
			</p>
			<address class="not-italic">
				<p>Patrick Arndt (Website Owner)</p>
				<p><b>Email:</b> photo@parndt.de</p>
				<p><b>Address:</b> Germany, 74532 Ilshofen, Ringstraße 2</p>
			</address>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">2. Disclaimer</h2>
			<p class="mb-4">
				We strive to keep the information on this website up to date, but we do not accept liability
				for the content provided. According to § 7 Abs.1 TMG, we are responsible for our own content
				on these pages in accordance with general laws. However, according to §§ 8 to 10 TMG, we are
				not obligated to monitor transmitted or stored third-party information.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">3. Copyright Notice</h2>
			<p class="mb-4">
				The content and works on these pages created by the site operators are subject to German
				copyright law. The reproduction, editing, distribution, and any kind of use outside the
				limits of copyright require the written consent of the respective author or creator.
				Downloads and copies of this page are only permitted for private, non-commercial use.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">4. External Links</h2>
			<p class="mb-4">
				This website contains links to external websites of third parties, on whose contents we have
				no influence. Therefore, we cannot assume any liability for these external contents. The
				respective provider or operator of the sites is always responsible for the content of the
				linked pages.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">5. Contact</h2>
			<p class="mb-4">
				If you have any questions regarding this imprint, you can contact us via the following
				details:
			</p>
			<address class="not-italic">
				<p>Email: photo@parndt.de</p>
				<!-- <p>Phone: [Your Phone Number]</p> -->
			</address>
		</section>
	</main>
</div>
<Footer />

<style>
	/* Add any additional component-specific styles here */
</style>
