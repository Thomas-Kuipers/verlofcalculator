<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import TextContent from '@/components/TextContent.vue'
import Money from '@/components/Money.vue'
import DaysWithMissedIncome from '@/components/DaysWithMissedIncome.vue'

const leaveStore = useLeaveStore()
</script>

<template>
    <tr>
        <td colspan="3"><h2 :class="$style.title">Financial impact</h2></td>
    </tr>
    <tr>
        <th />
        <th>Mom</th>
        <th>Second parent</th>
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
        <td>Days off @ <a target="_blank" href="https://www.uwv.nl/particulieren/ziek/ziek-zonder-werkgever/na-ziekmelding/detail/mijn-ziektewet-uitkering/hoe-hoog-is-mijn-ziektewet-uitkering/berekening-van-uw-dagloon#:~:text=Voor%20uw%20uitkering%20geldt%20een,de%20berekening%20van%20uw%20dagloon.">max UWV</a></td>
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeAtMaxUwv(true)"
            :days="leaveStore.daysOffAtMaxUwv(true)"
        />
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeAtMaxUwv(false)"
            :days="leaveStore.daysOffAtMaxUwv(false)"
        />
    </tr>
    <tr>
        <td>Days off @ 70%</td>
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeAt70Percent(true)"
            :days="leaveStore.daysOffAt70Percent(true)"
        />
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeAt70Percent(false)"
            :days="leaveStore.daysOffAt70Percent(false)"
        />
    </tr>
    <tr>
        <td>Days off unpaid</td>
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeUnpaid(true)"
            :days="leaveStore.daysOffUnpaid(true)"
        />
        <DaysWithMissedIncome
            :missed-income="leaveStore.missedIncomeUnpaid(false)"
            :days="leaveStore.daysOffUnpaid(false)"
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
