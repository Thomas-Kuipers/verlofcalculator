<script lang="ts" setup>
import { useLeaveStore, Week } from '@/stores/leave'
import DaySelector from '@/components/DaySelector.vue'
import { getMinimumDaysInWeek } from '@/stores/leave'
import DueDateSelector from '@/components/DueDateSelector.vue'
import { computed } from 'vue'

const props = defineProps<{
	n: number
	week: Week
}>()

const leaveStore = useLeaveStore()

const date = computed<string>(() => {
	if (leaveStore.personal.dueDate === null || leaveStore.personal.dueDate.getUTCFullYear() < 1900 ) {
		return ''
	}

	const cloned = new Date(leaveStore.personal.dueDate.valueOf())
	cloned.setDate(cloned.getDate() + 7 * (props.n - 1))
	return cloned.getDate() + '/' + (cloned.getMonth() + 1) + '/' + cloned.getUTCFullYear()
})

const childcareDays = computed(() =>
    Math.max(0, 5 - props.week.daysOffMom - props.week.daysOffSecondParent)
)
</script>

<template>
	<tr>
		<td>{{ n }}</td>
		<td :class="$style.date">
			<DueDateSelector v-if="n === 1" />
			<span v-else >{{ date }}</span>
		</td>
		<td title="Try click and drag!">
			<DaySelector
				:week-number="n"
				:days="week.daysOffMom"
				:minimum-days="getMinimumDaysInWeek(true, n)"
				:mom="true"
			/>
		</td>
        <td title="Try click and drag!">
			<DaySelector
				:week-number="n"
				:days="week.daysOffSecondParent"
				:minimum-days="getMinimumDaysInWeek(false, n)"
				:mom="false"
			/>
		</td>
        <td>
            {{ childcareDays }}
        </td>
	</tr>
</template>

<style lang="scss" module>
.date {
	font-variant-numeric: tabular-nums;
	text-align: right;
}
</style>
