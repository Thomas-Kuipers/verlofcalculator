<script lang="ts" setup>
import {
    missedIncomeForRegulationPerDay,
    useLeaveStore,
    YearMonth,
    YearMonthIncome,
    yearMonthKey,
    YearMonthLeaveDays,
    YearMonthRegulations
} from '@/stores/leave'
import { computed } from 'vue'
import RowWithInfo from '@/components/RowWithInfo.vue'
import Money from '@/components/Money.vue'
import YearMonthRegulationInfo from '@/components/YearMonthRegulationInfo.vue'
import { formatMoney } from '@/helpers/formatMoney'

const props = defineProps<{
    yearMonth: YearMonth
    leaveDaysMom: YearMonthLeaveDays | null
    leaveDaysPartner: YearMonthLeaveDays | null
    regulationsMom: YearMonthRegulations | null
    regulationsPartner: YearMonthRegulations | null
    incomeMom: YearMonthIncome | null
    incomePartner: YearMonthIncome | null
}>()

const leaveStore = useLeaveStore()

function getTitle(yearMonth: YearMonth): string {
    const date = new Date(yearMonth.year, yearMonth.month, 1)
    return date.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    })
}

const key = computed(() => yearMonthKey(props.yearMonth.year, props.yearMonth.month))

function calculationSentence(
    mom: boolean,
    yearMonthRegulations: YearMonthRegulations,
    yearMonthIncome: YearMonthIncome,
): string | undefined {
    const regulations = yearMonthRegulations[key.value]
    if (!regulations) {
        return
    }

    const dailySalary = leaveStore.dailySalary(mom)
    if (!dailySalary) {
        return
    }

    const monthlySalary = leaveStore.normalMonthlyIncome(mom)
    if (!monthlySalary) {
        return
    }

    const parts: string[] = []

    Object.keys(regulations).forEach(regulationId => {
        const regulation = leaveStore.regulations.find(reg => reg.id === regulationId)
        const days = regulations[regulationId]
        const missedIncomePerDay = missedIncomeForRegulationPerDay(regulation!!, dailySalary)

        parts.push(days + ' × ' + formatMoney(missedIncomePerDay))
    })

    return formatMoney(monthlySalary) + ' − (' + parts.join(' + ') + ') = ' + formatMoney(yearMonthIncome[key.value])
}

const calculationMom = computed(() => {
    if (!props.regulationsMom || !props.incomeMom) {
        return
    }

    return calculationSentence(true, props.regulationsMom, props.incomeMom)
})

const calculationPartner = computed(() => {
    if (!props.regulationsPartner || !props.incomePartner) {
        return
    }

    return calculationSentence(false, props.regulationsPartner, props.incomePartner)
})
</script>

<template>
    <RowWithInfo :title="getTitle(yearMonth)" >
        <td><Money v-if="incomeMom" :value="incomeMom[key]" /></td>
        <td><Money v-if="incomePartner" :value="incomePartner[key]" /></td>
        <td><Money v-if="incomePartner && incomeMom" :value="incomePartner[key] + incomeMom[key]" /></td>
        <template #info>
            <template v-if="leaveDaysMom && incomeMom && regulationsMom">
                <h3>Mom</h3>
                <ul>
                    <li>Taking a total of {{ leaveDaysMom[key] }} days of leave this month.</li>
                    <YearMonthRegulationInfo
                        v-for="regulationId in Object.keys(regulationsMom[key])"
                        :month="yearMonth.month"
                        :year="yearMonth.year"
                        :regulationId="regulationId"
                        :days="regulationsMom!!"
                        :mom="true"
                    />
                    <li v-if="leaveDaysMom[key] > 0">
                        {{ calculationMom }}
                    </li>
                </ul>
            </template>
            <template v-if="leaveDaysPartner && incomePartner && regulationsPartner">
                <h3>Partner</h3>
                <ul>
                    <li>Taking a total of {{ leaveDaysPartner[key] }} days of leave this month.</li>
                    <YearMonthRegulationInfo
                        v-for="regulationId in Object.keys(regulationsPartner[key])"
                        :month="yearMonth.month"
                        :year="yearMonth.year"
                        :regulationId="regulationId"
                        :days="regulationsPartner!!"
                        :mom="false"
                    />
                    <li v-if="leaveDaysPartner[key] > 0">
                        {{ calculationPartner }}
                    </li>
                </ul>
            </template>
        </template>
    </RowWithInfo>
</template>