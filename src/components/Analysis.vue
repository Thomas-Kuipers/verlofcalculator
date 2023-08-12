<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import { computed } from 'vue'
import TextContent from '@/components/TextContent.vue'
import { translate } from '@/helpers/translate'

const leaveStore = useLeaveStore()
const { t } = translate()

const dayCountSentence = computed<string>(() => {
	const totalDaysOffMom = leaveStore.totalDaysUsed(true)
	const totalDaysOffSecondParent = leaveStore.totalDaysUsed(false)

	if (totalDaysOffMom > totalDaysOffSecondParent) {
		return t('analysisMomMoreThanPartner', {
            days: totalDaysOffMom - totalDaysOffSecondParent
        })
	} else if (totalDaysOffMom < totalDaysOffSecondParent) {
		return t('analysisPartnerMoreThanMom', {
            days: totalDaysOffSecondParent - totalDaysOffMom
        })
	} else {
        return t('analysisEqualDays')
	}
})

function weeksSentence(mom: boolean): string {
    const normalDaysPerWeek =
        (mom ? leaveStore.personal.normalHoursPerWeekMom : leaveStore.personal.normalHoursPerWeekSecondParent) / 8
    const weeks = leaveStore.daysPerWeek(mom)
	const fullWeeks = weeks.filter(days => days === normalDaysPerWeek).length
	const parttimeWeeks = weeks.filter(days => days < normalDaysPerWeek && days > 0).length

	if (parttimeWeeks === 0) {
        return t(mom ? 'analysisWeeksOffMom' : 'analysisWeeksOffPartner', {
            weeks: fullWeeks
        })
	}

	const averagePerParttimeWeek = Math.round(
		weeks
			.filter(days => days < normalDaysPerWeek)
			.reduce((total: number, days: number) => total + days, 0) / parttimeWeeks * 10
	) / 10

    return t(mom ? 'analysisWeeksAndDaysOffMom' : 'analysisWeeksAndDaysOffPartner', {
        weeks: fullWeeks,
        days: averagePerParttimeWeek,
        parttimeWeeks: parttimeWeeks
    })
}

const weeksMomSentence = computed<string>(() => {
	return weeksSentence(true)
})

const weeksSecondParentSentence = computed<string>(() => {
	return weeksSentence(false)
})

// const childcareSentence = computed<string>(() => {
//     return t('analysisChildcare', {
//         days: leaveStore.totalChildcareDays
//     })
// })

</script>

<template>
	<div :class="$style.container">
        <TextContent>
            <h2>{{ t('analysisTitle') }}</h2>
            <ul>
                <li>{{ dayCountSentence }}</li>
                <li>{{ weeksMomSentence }}</li>
                <li>{{ weeksSecondParentSentence }}</li>
<!--                <li>{{ childcareSentence }}</li>-->
            </ul>
        </TextContent>
	</div>
</template>

<style lang="scss" module>
.container {
    margin: 0 16px 24px 0;
}
</style>
