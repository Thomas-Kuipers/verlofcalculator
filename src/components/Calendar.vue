<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import Week from '@/components/Week.vue'

const leaveStore = useLeaveStore()
</script>

<template>
	<table :class="$style.table">
		<thead>
		<tr>
			<th>Week</th>
			<th>Date</th>
			<th>Days off mom</th>
			<th>Days off second parent</th>
            <th>Days childcare</th>
		</tr>
		</thead>
		<tbody>
		<Week
			v-for="(week, i) in leaveStore.weeks"
			:week="week"
			:n="i + 1"
		/>
		</tbody>
	</table>
</template>

<style lang="scss" module>
.table {
    margin: 0 16px 16px;

    th {
        font-weight: bold;
        white-space: nowrap;
    }

    td,
    th {
        padding: 1px 16px 1px 0;
    }
}
</style>
