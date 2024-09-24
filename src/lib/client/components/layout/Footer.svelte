<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="h-16 border-t border-border bg-bg p-2 py-4 lg:p-4">
	<div class="flex flex-col justify-between md:flex-row">
		<p>&copy; {currentYear} Photo Parndt. All rights reserved.</p>
		<div class=" flex items-center space-x-4">
			<a href="/imprint" class="hover:underline">Imprint</a>
			<a href="/privacy" class="hover:underline">Privacy Policy</a>
		</div>
	</div>
</footer>
