<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import { computed } from 'vue'
import TextContent from '@/components/TextContent.vue'

const leaveStore = useLeaveStore()
const dayCountSentence = computed<string>(() => {
	const totalDaysOffMom = leaveStore.totalDaysUsed(true)
	const totalDaysOffSecondParent = leaveStore.totalDaysUsed(false)

	if (totalDaysOffMom > totalDaysOffSecondParent) {
		return 'Mom is taking ' + (totalDaysOffMom - totalDaysOffSecondParent) + ' more days off than the partner.'
	} else if (totalDaysOffMom < totalDaysOffSecondParent) {
		return 'The partner is taking ' + (totalDaysOffSecondParent - totalDaysOffMom) + ' more days off than mom.'
	} else {
		return 'Both parents are taking the same amount of days off.'
	}
})

function weeksSentence(weeks: number[]): string {
	const fullWeeks = weeks.filter(days => days === 5).length

	const entireWeeks = ' is taking ' + fullWeeks + ' entire weeks off'
	const parttimeWeeks = weeks.filter(days => days < 5 && days > 0).length

	if (parttimeWeeks === 0) {
		return entireWeeks + '.'
	}

	const averagePerParttimeWeek = Math.round(
		weeks
			.filter(days => days < 5)
			.reduce((total: number, days: number) => total + days, 0) / parttimeWeeks * 10
	) / 10

	return entireWeeks + ' plus on average ' + averagePerParttimeWeek + ' days per week spread out over ' + parttimeWeeks + ' weeks.'
}

const weeksMomSentence = computed<string>(() => {
	return 'Mom' + weeksSentence(leaveStore.daysPerWeek(true))
})

const weeksSecondParentSentence = computed<string>(() => {
	return 'The partner' + weeksSentence(leaveStore.daysPerWeek(false))
})

const childcareSentence = computed<string>(() => {
    const childcareDays = leaveStore.weeks.reduce((total, week) =>
        total + Math.max(0, 5 - week.daysOffMom - week.daysOffSecondParent)
    , 0)

    return 'This year will require ' + childcareDays + ' days of external childcare.'
})

</script>

<template>
	<div :class="$style.container">
        <TextContent>
            <h2>Analysis</h2>
            <ul>
                <li>{{ dayCountSentence }}</li>
                <li>{{ weeksMomSentence }}</li>
                <li>{{ weeksSecondParentSentence }}</li>
                <li>{{ childcareSentence }}</li>
            </ul>
        </TextContent>
	</div>
</template>

<style lang="scss" module>
.container {
    margin: 0 16px 24px 0;
}
</style>
