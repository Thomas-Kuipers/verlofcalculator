<script lang="ts" setup>
import {
    getNormalIncomePerDay,
    missedIncomeForRegulationPerDay,
    payoutPerDayForRegulation,
    Regulation,
    useLeaveStore, uwvMaximumDagloon
} from '@/stores/leave'
import { computed } from 'vue'
import { formatMoney } from '@/helpers/formatMoney'
import RowWithInfo from '@/components/RowWithInfo.vue'
import { translate } from '@/helpers/translate'
import DaysChart from '@/components/DaysChart.vue'
import Days from '@/components/Days.vue'

const props = defineProps<{
    regulation: Regulation
}>()

const leaveStore = useLeaveStore()
const { t } = translate()

const salaryMom = computed(() => {
    if (!props.regulation.mom) {
        return
    }

    const dailySalary = leaveStore.dailySalary(true)

    if (dailySalary === null) {
        return
    }

    const payoutPerDay = payoutPerDayForRegulation(props.regulation, dailySalary)
    const missedIncomePerDay = missedIncomeForRegulationPerDay(props.regulation, dailySalary)

    return t('payoutNormalAndMissingMom', {
        payoutPerDay: formatMoney(payoutPerDay),
        normalIncomePerDay: formatMoney(dailySalary),
        missedIncomePerDay: formatMoney(missedIncomePerDay),
    })
})

const salarySecondParent = computed(() => {
    if (!props.regulation.secondParent) {
        return
    }

    const dailySalary = leaveStore.dailySalary(false)

    if (dailySalary === null) {
        return
    }

    const payoutPerDay = payoutPerDayForRegulation(props.regulation, dailySalary)
    const missedIncomePerDay = missedIncomeForRegulationPerDay(props.regulation, dailySalary)

    return t('payoutNormalAndMissingPartner', {
        payoutPerDay: formatMoney(payoutPerDay),
        normalIncomePerDay: formatMoney(dailySalary),
        missedIncomePerDay: formatMoney(missedIncomePerDay),
    })
})
</script>

<template>
    <RowWithInfo :title="t(regulation.title)">
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, true) === regulation.daysOff }" v-if="regulation.mom">
            <Days :value="leaveStore.daysUsedByRegulation(regulation.id, true)" /> /
            <Days :value="regulation.daysOff(leaveStore.personal.normalHoursPerWeekMom)" />
        </td>
        <td v-if="!regulation.mom" :class="$style.na">N/A</td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, false) === regulation.daysOff }" v-if="regulation.secondParent">
            <Days :value="leaveStore.daysUsedByRegulation(regulation.id, false)" /> /
            <Days :value="regulation.daysOff(leaveStore.personal.normalHoursPerWeekSecondParent)" />
        </td>
        <td v-if="!regulation.secondParent" :class="$style.na">N/A</td>

        <template #info>
            <div v-html="t(regulation.info)" />
            <ul>
                <div v-html="t(regulation.infoList, {
                    uwvDailyMax: formatMoney(uwvMaximumDagloon),
                    seventyPercentOfUwvMax: formatMoney(0.7 * uwvMaximumDagloon),
                })" />
                <li v-if="salaryMom">{{ salaryMom }}</li>
                <li v-if="salarySecondParent">{{ salarySecondParent }}</li>
            </ul>
            <div v-html="t(regulation.infoLink, { url: regulation.url })" />
        </template>
    </RowWithInfo>
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';

.na {
    opacity: .3;
    background: #999;
}
tfoot td {
    border-top: 1px solid #ddd;
}

.days {
    background: #CFC;
}

.maxed {
    background: #FCC;
}
</style>
