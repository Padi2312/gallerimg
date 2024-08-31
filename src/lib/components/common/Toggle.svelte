<script lang="ts">
	type ToggleProps = {
		checked?: boolean;
		label?: string;
		id?: string;
	};
	let { checked = $bindable(false), label = '', id = crypto.randomUUID() }: ToggleProps = $props();
	let isChecked = $state(checked);
</script>

<div class="flex items-center">
	<label for={id} class="relative inline-flex cursor-pointer items-center">
		<input type="checkbox" {id} bind:checked={checked} class="peer sr-only" />
		<div
			class="peer h-6 w-11 rounded-full bg-border
      after:absolute after:start-[2px]
      after:top-[2px] after:h-5 after:w-5 after:rounded-full
      after:border after:border-border after:bg-white after:transition-all after:content-['']
      peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
		></div>
		{#if label}
			<span class="ms-3 text-sm font-medium">{label}</span>
		{/if}
	</label>
</div>
