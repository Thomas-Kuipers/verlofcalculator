<script lang="ts" setup>
import { useLeaveStore, Week } from '@/stores/leave'
import DaySelector from '@/components/DaySelector.vue'
import { computed } from 'vue'
import Days from '@/components/Days.vue'

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

const childcareDays = computed(() => leaveStore.childCareDaysPerWeek(props.week))
</script>

<template>
	<tr>
		<td>{{ n }}</td>
		<td :class="$style.date">
            {{ date }}
		</td>
		<td>
			<DaySelector
				:week-number="n"
				:days="week.daysOffMom"
				:minimum-days="leaveStore.getMinimumDaysInWeek(true, n)"
				:mom="true"
                :max="Math.min(Math.ceil(leaveStore.personal.normalHoursPerWeekMom / 8), 7)"
			/>
		</td>
        <td>
			<DaySelector
				:week-number="n"
				:days="week.daysOffSecondParent"
				:minimum-days="leaveStore.getMinimumDaysInWeek(false, n)"
				:mom="false"
                :max="Math.min(7, Math.ceil(leaveStore.personal.normalHoursPerWeekSecondParent / 8))"
			/>
		</td>
        <td>
            <Days :value="childcareDays" />
        </td>
	</tr>
</template>

<style lang="scss" module>
.date {
	font-variant-numeric: tabular-nums;
	text-align: right;
}
</style>
