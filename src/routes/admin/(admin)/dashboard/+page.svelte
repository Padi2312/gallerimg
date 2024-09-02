<script lang="ts">
	import DashboardCard from '$lib/client/components/admin/DashboardCard.svelte';
	import type { PageData } from './$types';
	type DashboardPageProps = {
		data: PageData;
	};
	let { data }: DashboardPageProps = $props();
</script>

<div>
	<div class="grid grid-rows-3 space-y-4 lg:grid-cols-3 lg:space-x-4 lg:space-y-0">
		<DashboardCard
			title="Total Photos"
			description="Amount of photos uploaded"
			value={data.imageCount}
		/>
		<DashboardCard title="Total Tags" description="Total number of created tags" value={'N/A'} />
		<DashboardCard
			title="Used Storage"
			description="Amount of storage being used"
			value={data.usedStorage}
		/>
	</div>
</div>
