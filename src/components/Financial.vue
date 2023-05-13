<script lang="ts" setup>
import { useLeaveStore, uwvMaximumDagloon } from '@/stores/leave'
import Money from '@/components/Money.vue'
import DaysWithMissedIncome from '@/components/DaysWithMissedIncome.vue'
import Tooltip from '@/components/Tooltip.vue'
import { formatMoney } from '@/helpers/formatMoney'
import RowWithInfo from '@/components/RowWithInfo.vue'
import { translate } from '@/helpers/translate'

const leaveStore = useLeaveStore()
const { t } = translate()
</script>

<template>
    <tr>
        <td colspan="3"><h2 :class="$style.title">{{ t('financialTitle') }}</h2></td>
    </tr>
    <tr>
        <th />
        <th>{{ t('financialThMom') }}</th>
        <th>{{ t('financialThPartner') }}</th>
    </tr>
    <RowWithInfo :title="t('financialDaysOffFullyPaid')">
        <td>{{ leaveStore.daysOffFullyPaid(true) }}</td>
        <td>{{ leaveStore.daysOffFullyPaid(false) }}</td>
        <template #info>
            <ul>
                <li>{{ t('appliesToRegulations', {
                    regulations: leaveStore.regulationsFullyPaid.map(regulation => t(regulation.title)).join(', ')
                })}}</li>
            </ul>
        </template>
    </RowWithInfo>
    <RowWithInfo :title="t('daysOffAtMaxUwv')">
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeAtMaxUwv(true)"
            :days="leaveStore.daysOffAtMaxUwv(true)"
        />
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeAtMaxUwv(false)"
            :days="leaveStore.daysOffAtMaxUwv(false)"
        />
        <template #info>
            <ul>
                <li>{{ t('appliesToRegulations', {
                    regulations: leaveStore.regulationsMaxUwv.map(regulation => t(regulation.title)).join(', ')
                })}}</li>
                <li v-html="t('dailySalaryAtMaxUwvDescriptionHtml', { url: 'https://www.uwv.nl/particulieren/ziek/ziek-zonder-werkgever/na-ziekmelding/detail/mijn-ziektewet-uitkering/hoe-hoog-is-mijn-ziektewet-uitkering/berekening-van-uw-dagloon#:~:text=Voor%20uw%20uitkering%20geldt%20een,de%20berekening%20van%20uw%20dagloon.', maxUwv: formatMoney(uwvMaximumDagloon) }) "/>
                <li v-if="leaveStore.dailySalary(true) !== null">
                    {{ t('payoutNormalAndMissingMom', {
                        payoutPerDay: formatMoney(leaveStore.payoutAtMaxUwv(true)),
                        normalIncomePerDay: formatMoney(leaveStore.dailySalary(true)),
                        missedIncomePerDay: formatMoney(leaveStore.missedIncomeAtMaxUwv(true)),
                    })}}
                </li>
                <li v-if="leaveStore.dailySalary(false) !== null">
                    {{ t('payoutNormalAndMissingPartner', {
                        payoutPerDay: formatMoney(leaveStore.payoutAtMaxUwv(false)),
                        normalIncomePerDay: formatMoney(leaveStore.dailySalary(false)),
                        missedIncomePerDay: formatMoney(leaveStore.missedIncomeAtMaxUwv(false)),
                    }) }}
                </li>
            </ul>
        </template>
    </RowWithInfo>
    <RowWithInfo :title="t('daysOffAtSeventyPercent')">
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeAt70Percent(true)"
            :days="leaveStore.daysOffAt70Percent(true)"
        />
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeAt70Percent(false)"
            :days="leaveStore.daysOffAt70Percent(false)"
        />
        <template #info>
            <ul>
                <li>{{ t('appliesToRegulations', {
                    regulations: leaveStore.regulations70Percent.map(regulation => t(regulation.title)).join(', ')
                })}}</li>
                <li v-html="t('dailySalaryAtSeventyPercentDescriptionHtml', { maxUwvSeventy: formatMoney(uwvMaximumDagloon * 0.7) }) "/>
                <li v-if="leaveStore.dailySalary(true) !== null">
                    {{ t('payoutNormalAndMissingMom', {
                    payoutPerDay: formatMoney(leaveStore.payoutAt70Percent(true)),
                    normalIncomePerDay: formatMoney(leaveStore.dailySalary(true)),
                    missedIncomePerDay: formatMoney(leaveStore.missedIncomeAt70Percent(true)),
                })}}
                </li>
                <li v-if="leaveStore.dailySalary(false) !== null">
                    {{ t('payoutNormalAndMissingPartner', {
                    payoutPerDay: formatMoney(leaveStore.payoutAt70Percent(false)),
                    normalIncomePerDay: formatMoney(leaveStore.dailySalary(false)),
                    missedIncomePerDay: formatMoney(leaveStore.missedIncomeAt70Percent(false)),
                }) }}
                </li>
            </ul>
        </template>
    </RowWithInfo>
    <RowWithInfo :title="t('daysOffUnpaid')">
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeUnpaid(true)"
            :days="leaveStore.daysOffUnpaid(true)"
        />
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeUnpaid(false)"
            :days="leaveStore.daysOffUnpaid(false)"
        />
        <template #info>
            <ul>
                <li>{{ t('appliesToRegulations', {
                    regulations: leaveStore.regulationsUnpaid.map(regulation => t(regulation.title)).join(', ')
                })}}</li>
                <li v-if="leaveStore.dailySalary(true) !== null">
                    {{ t('daysOffUnpaidMomCost', { dailySalary: formatMoney(leaveStore.dailySalary(true)) } )}}
                </li>
                <li v-if="leaveStore.dailySalary(false) !== null">
                    {{ t('daysOffUnpaidPartnerCost', { dailySalary: formatMoney(leaveStore.dailySalary(false)) } )}}
                </li>
            </ul>
        </template>
    </RowWithInfo>
    <tr>
        <td>{{ t('totalGrossMissedIncome') }}</td>
        <td><Money hide-zero :value="leaveStore.totalMissedIncome(true)" /></td>
        <td><Money hide-zero :value="leaveStore.totalMissedIncome(false)" /></td>
    </tr>
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
