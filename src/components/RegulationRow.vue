<script lang="ts" setup>
import {
    getNormalIncomePerDay,
    missedIncomeForRegulationPerDay,
    payoutPerDayForRegulation,
    Regulation,
    useLeaveStore
} from '@/stores/leave'
import { computed } from 'vue'
import { formatMoney } from '@/helpers/formatMoney'
import RowWithInfo from '@/components/RowWithInfo.vue'

const props = defineProps<{
    regulation: Regulation
}>()

const leaveStore = useLeaveStore()

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

    return `Mom gets paid ${formatMoney(payoutPerDay)} per day, while normally getting paid ${formatMoney(normalIncomePerDay)}, meaning she misses out on ${formatMoney(missedIncomePerDay)} per day.`
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

    return `The partner gets paid ${formatMoney(payoutPerDay)} per day, while normally getting paid ${formatMoney(normalIncomePerDay)}, meaning they miss out on ${formatMoney(missedIncomePerDay)} per day.`
})
</script>

<template>
    <RowWithInfo :title="regulation.title">
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, true) === regulation.daysOff }" v-if="regulation.mom">{{ leaveStore.daysUsedByRegulation(regulation.id, true) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.mom" :class="$style.na">N/A</td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, false) === regulation.daysOff }" v-if="regulation.secondParent">{{ leaveStore.daysUsedByRegulation(regulation.id, false) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.secondParent" :class="$style.na">N/A</td>

        <template #info>
            <p>Official title: {{ regulation.officialTitle }}</p>
            <ul>
                <li v-for="line in regulation.description">{{ line }}</li>
                <li v-if="salaryMom">{{ salaryMom }}</li>
                <li v-if="salarySecondParent">{{ salarySecondParent }}</li>
            </ul>
            <p>More info on <a target="_blank" :href="regulation.url">rijksoverheid.nl</a></p>
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
