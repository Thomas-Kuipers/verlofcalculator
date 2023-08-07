<script lang="ts" setup>
import { useLeaveStore, uwvMaximumDagloon, YearMonth } from '@/stores/leave'
import Money from '@/components/Money.vue'
import DaysWithMissedIncome from '@/components/DaysWithMissedIncome.vue'
import Tooltip from '@/components/Tooltip.vue'
import { formatMoney } from '@/helpers/formatMoney'
import RowWithInfo from '@/components/RowWithInfo.vue'
import { translate } from '@/helpers/translate'
import { computed } from 'vue'

const leaveStore = useLeaveStore()
const { t } = translate()

const yearMonths = computed(() => leaveStore.yearMonths)

function getTitle(yearMonth: YearMonth): string {
    const date = new Date(yearMonth.year, yearMonth.month, 1)
    return date.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    })
}
</script>

<template>
    <tr>
        <td colspan="3"><h2 :class="$style.title">Monthly income estimates</h2></td>
    </tr>
    <tr>
        <th />
        <th>{{ t('financialThMom') }}</th>
        <th>{{ t('financialThPartner') }}</th>
    </tr>
    <RowWithInfo v-for="yearMonth in yearMonths" :title="getTitle(yearMonth)" >
        <td></td>
        <td></td>
        <template #info>
            <ul>
                <li></li>
            </ul>
        </template>
    </RowWithInfo>
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';

.title {
    @include typography.title2;
}

.salaryInput {
    width: 90px;
}
</style>
