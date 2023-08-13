<script lang="ts" setup>
import { useLeaveStore, uwvMaximumDagloon, YearMonth, yearMonthKey } from '@/stores/leave'
import Money from '@/components/Money.vue'
import DaysWithMissedIncome from '@/components/DaysWithMissedIncome.vue'
import Tooltip from '@/components/Tooltip.vue'
import { formatMoney } from '@/helpers/formatMoney'
import RowWithInfo from '@/components/RowWithInfo.vue'
import { translate } from '@/helpers/translate'
import { computed } from 'vue'
import YearMonthRegulationInfo from '@/components/YearMonthRegulationInfo.vue'
import FinancialMonthRow from '@/components/FinancialMonthRow.vue'

const leaveStore = useLeaveStore()
const { t } = translate()

const yearMonthLeaveDaysMom = computed(() => leaveStore.yearMonthLeaveDays(true))
const yearMonthLeaveDaysPartner = computed(() => leaveStore.yearMonthLeaveDays(false))
const yearMonthRegulationsMom = computed(() => leaveStore.yearMonthRegulations(true))
const yearMonthRegulationsPartner = computed(() => leaveStore.yearMonthRegulations(false))
const yearMonthIncomeMom = computed(() => leaveStore.yearMonthIncome(true))
const yearMonthIncomePartner = computed(() => leaveStore.yearMonthIncome(false))

const yearMonths = computed(() => {
    if (leaveStore.personal.dueDate === null) {
        return []
    }

    const date = new Date(leaveStore.personal.dueDate.valueOf())
    const result: YearMonth[] = []

    for (let i = 0; i < 12; i ++) {
        const yearMonth = {
           year: date.getFullYear(),
           month: date.getMonth()
        }

        date.setMonth(date.getMonth() + 1)
        result.push(yearMonth)
    }

    return result
})
</script>

<template>
    <tr>
        <td colspan="3"><h2 :class="$style.title">Gross monthly income</h2></td>
    </tr>
    <tr>
        <th />
        <th>{{ t('financialThMom') }}</th>
        <th>{{ t('financialThPartner') }}</th>
        <th :class="$style.total">Total</th>
    </tr>
    <FinancialMonthRow
        v-for="yearMonth in yearMonths"
        :yearMonth="yearMonth"
        :incomeMom="yearMonthIncomeMom"
        :incomePartner="yearMonthIncomePartner"
        :leave-days-mom="yearMonthLeaveDaysMom"
        :leave-days-partner="yearMonthLeaveDaysPartner"
        :regulations-mom="yearMonthRegulationsMom"
        :regulations-partner="yearMonthRegulationsPartner"
    />
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';

.title {
    @include typography.title2;
}

.total {
    width: 90px;
}
</style>
