<script lang="ts" setup>
import { useLeaveStore, uwvMaximumDagloon } from '@/stores/leave'
import TextContent from '@/components/TextContent.vue'
import Money from '@/components/Money.vue'
import DaysWithMissedIncome from '@/components/DaysWithMissedIncome.vue'
import Tooltip from '@/components/Tooltip.vue'
import { formatMoney } from '@/helpers/formatMoney'

const leaveStore = useLeaveStore()
</script>

<template>
    <tr>
        <td colspan="3"><h2 :class="$style.title">Financial impact</h2></td>
    </tr>
    <tr>
        <th />
        <th>Mom</th>
        <th>Partner</th>
    </tr>
    <tr>
        <td>Gross yearly salary</td>
        <td>
            <input
                type="number"
                @keyup="event => leaveStore.setGrossYearlySalary(parseInt(event.currentTarget.value), true)"
            />
        </td>
        <td>
            <input
                type="number"
                @keyup="event => leaveStore.setGrossYearlySalary(parseInt(event.currentTarget.value), false)"
            />
        </td>
    </tr>
    <tr>
        <td>Days off fully paid</td>
        <td>{{ leaveStore.daysOffFullyPaid(true) }}</td>
        <td>{{ leaveStore.daysOffFullyPaid(false) }}</td>
    </tr>
    <tr>
        <td>
            <Tooltip :tooltip="`You get paid 100% of your own daily wage, or the maximum of UWV (${formatMoney(uwvMaximumDagloon)}), whichever is less`">
                Days off @ <a target="_blank" href="https://www.uwv.nl/particulieren/ziek/ziek-zonder-werkgever/na-ziekmelding/detail/mijn-ziektewet-uitkering/hoe-hoog-is-mijn-ziektewet-uitkering/berekening-van-uw-dagloon#:~:text=Voor%20uw%20uitkering%20geldt%20een,de%20berekening%20van%20uw%20dagloon.">max UWV</a>
            </Tooltip>
        </td>
        <DaysWithMissedIncome
            :normal-income="leaveStore.dailySalary(true)"
            :payout="leaveStore.payoutAtMaxUwv(true)"
            :missed-income="leaveStore.missedIncomeAtMaxUwv(true)"
            :days="leaveStore.daysOffAtMaxUwv(true)"
        />
        <DaysWithMissedIncome
            :normal-income="leaveStore.dailySalary(false)"
            :missed-income="leaveStore.missedIncomeAtMaxUwv(false)"
            :payout="leaveStore.payoutAtMaxUwv(false)"
            :days="leaveStore.daysOffAtMaxUwv(false)"
        />
    </tr>
    <tr>
        <td>
            <Tooltip :tooltip="`You get paid 70% of your own daily wage, or 70% of the maximum of UWV (${formatMoney(0.7 * uwvMaximumDagloon)}), whichever is less`">
                Days off @ 70%
            </Tooltip>
        </td>
        <DaysWithMissedIncome
            :normal-income="leaveStore.dailySalary(true)"
            :missed-income="leaveStore.missedIncomeAt70Percent(true)"
            :payout="leaveStore.payoutAt70Percent(true)"
            :days="leaveStore.daysOffAt70Percent(true)"
        />
        <DaysWithMissedIncome
            :normal-income="leaveStore.dailySalary(false)"
            :missed-income="leaveStore.missedIncomeAt70Percent(false)"
            :payout="leaveStore.payoutAt70Percent(false)"
            :days="leaveStore.daysOffAtMaxUwv(false)"
        />
    </tr>
    <tr>
        <td>Days off unpaid</td>
        <DaysWithMissedIncome
            :normal-income="null"
            :missed-income="leaveStore.missedIncomeUnpaid(true)"
            :days="leaveStore.daysOffUnpaid(true)"
            :payout="null"
        />
        <DaysWithMissedIncome
            :normal-income="null"
            :missed-income="leaveStore.missedIncomeUnpaid(false)"
            :days="leaveStore.daysOffUnpaid(false)"
            :payout="null"
        />
    </tr>
    <tr>
        <td>Total gross missed income</td>
        <td><Money hide-zero :value="leaveStore.totalMissedIncome(true)" /></td>
        <td><Money hide-zero :value="leaveStore.totalMissedIncome(false)" /></td>
    </tr>
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';

.title {
    @include typography.title2;
}
</style>
