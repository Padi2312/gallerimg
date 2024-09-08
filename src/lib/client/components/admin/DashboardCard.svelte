<script lang="ts">
	import type { Snippet } from 'svelte';

	type DashboardCardProps = {
		title: string;
		value: string | number;
		children?: Snippet;
		description?: string;
	};

	let { title, value, description, children = undefined }: DashboardCardProps = $props();
</script>

<div class="block min-w-48 flex-col space-y-4 rounded-lg border border-border p-4 shadow-lg">
	<div class="flex flex-col space-y-1">
		<h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">{title}</h3>
		{#if description}
			<div class="text-muted-foreground text-sm">{description}</div>
		{/if}
	</div>
	<div class="p-6">
		{#if children}
			<div class="flex space-x-6">
				<div class="text-4xl font-bold md:text-6xl">{value}</div>
				{@render children()}
			</div>
		{:else if !children && value}
			<div class="text-4xl font-bold md:text-6xl">{value}</div>
		{/if}
	</div>
</div>
