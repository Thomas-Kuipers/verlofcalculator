<script lang="ts" setup>
import {
    missedIncomeForRegulationPerDay,
    payoutPerDayForRegulation,
    useLeaveStore,
    yearMonthKey,
    YearMonthRegulations
} from '@/stores/leave'
import { computed } from 'vue'
import { translate } from '@/helpers/translate'
import { formatMoney } from '../helpers/formatMoney'

const props = defineProps<{
    regulationId: string
    year: number
    month: number
    days: YearMonthRegulations
    mom: boolean
}>()

const leaveStore = useLeaveStore()
const regulation = computed(() => leaveStore.regulations.find(reg => reg.id === props.regulationId))
const key = yearMonthKey(props.year, props.month)
const { t } = translate()

const sentence = computed(() => {
    const dailySalary = leaveStore.dailySalary(props.mom)

    if (dailySalary === null) {
        return
    }

    const payoutPerDay = payoutPerDayForRegulation(regulation.value!!, dailySalary)
    const missedIncomePerDay = missedIncomeForRegulationPerDay(regulation.value!!, dailySalary)
    const translation = props.mom ? 'payoutNormalAndMissingMom' : 'payoutNormalAndMissingPartner'

    return t(translation, {
        payoutPerDay: formatMoney(payoutPerDay),
        normalIncomePerDay: formatMoney(dailySalary),
        missedIncomePerDay: formatMoney(missedIncomePerDay),
    })
})
</script>

<template>
    <li v-if="days[key][regulationId] > 0">
        {{ t(regulation?.title) }}: {{ days[key][regulationId] }} days.
        {{ sentence }}
    </li>
</template>
