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

const props = defineProps<{
    regulation: Regulation
}>()

const leaveStore = useLeaveStore()
const { t } = translate()

const salaryMom = computed(() => {
    if (!props.regulation.mom) {
        return
    }

    const yearlySalary = leaveStore.yearlySalary(true)

    if (yearlySalary === null) {
        return
    }

    const normalIncomePerDay = getNormalIncomePerDay(yearlySalary)
    const payoutPerDay = payoutPerDayForRegulation(props.regulation, normalIncomePerDay)
    const missedIncomePerDay = missedIncomeForRegulationPerDay(props.regulation, yearlySalary)

    return t('payoutNormalAndMissingMom', {
        payoutPerDay: formatMoney(payoutPerDay),
        normalIncomePerDay: formatMoney(normalIncomePerDay),
        missedIncomePerDay: formatMoney(missedIncomePerDay),
    })
})

const salarySecondParent = computed(() => {
    if (!props.regulation.secondParent) {
        return
    }

    const yearlySalary = leaveStore.yearlySalary(false)

    if (yearlySalary === null) {
        return
    }

    const normalIncomePerDay = getNormalIncomePerDay(yearlySalary)
    const payoutPerDay = payoutPerDayForRegulation(props.regulation, normalIncomePerDay)
    const missedIncomePerDay = missedIncomeForRegulationPerDay(props.regulation, yearlySalary)

    return t('payoutNormalAndMissingPartner', {
        payoutPerDay: formatMoney(payoutPerDay),
        normalIncomePerDay: formatMoney(normalIncomePerDay),
        missedIncomePerDay: formatMoney(missedIncomePerDay),
    })
})
</script>

<template>
    <RowWithInfo :title="t(regulation.title)">
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, true) === regulation.daysOff }" v-if="regulation.mom">{{ leaveStore.daysUsedByRegulation(regulation.id, true) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.mom" :class="$style.na">N/A</td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, false) === regulation.daysOff }" v-if="regulation.secondParent">{{ leaveStore.daysUsedByRegulation(regulation.id, false) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.secondParent" :class="$style.na">N/A</td>

        <template #info>
            <div v-html="t(regulation.info)" />
            <ul>
                <div v-html="t(regulation.infoList, { uwvDailyMax: formatMoney(uwvMaximumDagloon) })" />
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
