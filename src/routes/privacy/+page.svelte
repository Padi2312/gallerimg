<script>
	import Footer from '../../lib/client/components/layout/Footer.svelte';
	import Header from '../../lib/client/components/layout/Header.svelte';
</script>

<div class="min-h-screen bg-bg text-text">
	<Header />
	<header class="bg-bg-secondary py-6">
		<div class="container mx-auto px-4">
			<h1 class="text-3xl font-bold">Data Privacy Policy</h1>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">1. Data Controller</h2>
			<p class="mb-4">
				The controller responsible for processing your personal data in connection with the
				newsletter is:
			</p>
			<address class="not-italic">
				<p>Responsible person: Patrick Arndt (Website owner)</p>
			</address>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">2. What Data is Processed?</h2>
			<p class="mb-4">For sending the newsletter, we only process the following personal data:</p>
			<ul class="mb-4 list-inside list-disc">
				<li>Your email address</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">3. Purpose of Data Processing</h2>
			<p class="mb-4">
				Your personal data is processed solely for the purpose of sending you our newsletter, which
				contains information about news. Your data will not be used for other purposes or sold to
				third parties.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">4. Legal Basis for Processing</h2>
			<p class="mb-4">
				The processing of your data is based on your voluntary consent, in accordance with Art.
				6(1)(a) GDPR. You can withdraw this consent at any time without providing reasons, effective
				for the future (see point 7).
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">5. Disclosure of Data to Third Parties</h2>
			<p class="mb-4">
				Your personal data will only be disclosed to third parties under the following
				circumstances:
			</p>
			<ul class="mb-4 list-inside list-disc">
				<li>
					<strong>Processors:</strong> We engage external service providers (e.g., for sending the newsletter
					or IT services). These service providers are contractually obligated to protect your data in
					compliance with legal requirements and to process it only according to our instructions.
				</li>
				<li>
					<strong>Legal Obligations:</strong> We may also disclose your data if we are legally required
					to do so, e.g., to authorities or courts.
				</li>
			</ul>
			<p class="mb-4">
				Your personal data will not be transferred to third countries or international organizations
				unless this is necessary to fulfill our obligations and complies with the requirements of
				Art. 44 ff. GDPR.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">6. Data Retention</h2>
			<p class="mb-4">
				Your personal data will be stored as long as you remain subscribed to the newsletter. Upon
				unsubscribing, your email address will be promptly deleted unless longer retention periods
				are required by law (e.g., under commercial or tax law).
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">7. Your Rights</h2>
			<p class="mb-4">Under applicable data protection laws, you have the following rights:</p>
			<ul class="mb-4 list-inside list-disc">
				<li>Right of Access</li>
				<li>Right to Rectification</li>
				<li>Right to Erasure</li>
				<li>Right to Restrict Processing</li>
				<li>Right to Data Portability</li>
				<li>Right to Object</li>
				<li>Right to Withdraw Consent</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold">8. Contact</h2>
			<p class="mb-4">
				If you have any questions about the processing of your personal data or wish to exercise
				your rights, you can contact us at any time at the following address:
			</p>
			<address class="not-italic">
				<p>Email: photo@parndt.de</p>
				<!-- <p>Phone: [Phone Number of the Data Protection Officer]</p> -->
			</address>
		</section>
	</main>

	<Footer />
</div>

<style>
	/* Add any additional component-specific styles here */
</style>
