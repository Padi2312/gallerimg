<script lang="ts">
	type LoadingSpinnerProps = {
		size?: number;
	};
	let { size = 5 }: LoadingSpinnerProps = $props();
</script>

<div
	class="h-{size} w-{size} animate-spin rounded-full border-4 border-solid border-border border-e-transparent
    align-[-0.125em] text-text motion-reduce:animate-[spin_1.5s_linear_infinite]"
	role="status"
></div>
