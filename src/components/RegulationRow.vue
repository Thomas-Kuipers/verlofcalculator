<script lang="ts" setup>
import {
    getNormalIncomePerDay,
    missedIncomeForRegulationPerDay,
    payoutPerDayForRegulation,
    Regulation,
    useLeaveStore
} from '@/stores/leave'
import { computed, ref } from 'vue'
import TextContent from '@/components/TextContent.vue'
import CaretDown from '@/assets/icons/caret-down.svg'
import RowInfo from '@/components/RowInfo.vue'
import { formatMoney } from '@/helpers/formatMoney'

const props = defineProps<{
    regulation: Regulation
}>()

const leaveStore = useLeaveStore()
const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value

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

    return `The second parent gets paid ${formatMoney(payoutPerDay)} per day, while normally getting paid ${formatMoney(normalIncomePerDay)}, meaning they miss out on ${formatMoney(missedIncomePerDay)} per day.`
})
</script>

<template>
    <tr>
        <td>
            <button :class="$style.expand" @click="toggle">
                <span>{{ regulation.title }}</span>
                <img :src="CaretDown" alt="Arrow down" :class="$style.caret" />
            </button>
        </td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, true) === regulation.daysOff }" v-if="regulation.mom">{{ leaveStore.daysUsedByRegulation(regulation.id, true) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.mom" :class="$style.na">N/A</td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, false) === regulation.daysOff }" v-if="regulation.secondParent">{{ leaveStore.daysUsedByRegulation(regulation.id, false) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.secondParent" :class="$style.na">N/A</td>
    </tr>
    <RowInfo v-if="expanded">
        <p>Official title: {{ regulation.officialTitle }}</p>
        <ul>
            <li v-for="line in regulation.description">{{ line }}</li>
            <li v-if="salaryMom">{{ salaryMom }}</li>
            <li v-if="salarySecondParent">{{ salarySecondParent }}</li>
        </ul>
        <p>More info on <a target="_blank" :href="regulation.url">rijksoverheid.nl</a></p>
    </RowInfo>
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

.expand {
    position: relative;
    text-decoration: underline;
    width: 100%;
    text-align: left;
    padding-right: 30px;
}

.caret {
    width: 30px;
    position: absolute;
    right: 0;
    top: -6px;
}
</style>
