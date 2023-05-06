<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'

const leaveStore = useLeaveStore()
</script>

<template>
    <tr>
        <td colspan="3">
                <h2 :class="$style.title">Regulatory days usage</h2>
        </td>
    </tr>
    <tr>
        <th>Regulation</th>
        <th>Mom</th>
        <th>Second parent</th>
    </tr>
    <tr v-for="regulation in leaveStore.regulations">
        <td><a :href="regulation.url" target="_blank">{{ regulation.title }}</a></td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, true) === regulation.daysOff }" v-if="regulation.mom">{{ leaveStore.daysUsedByRegulation(regulation.id, true) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.mom" :class="$style.na">N/A</td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, false) === regulation.daysOff }" v-if="regulation.secondParent">{{ leaveStore.daysUsedByRegulation(regulation.id, false) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.secondParent" :class="$style.na">N/A</td>
    </tr>
    <tr>
        <td>Total days off</td>
        <td>{{ leaveStore.totalDaysUsed(true) }}</td>
        <td>{{ leaveStore.totalDaysUsed(false) }}</td>
    </tr>
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';

.title {
    @include typography.title2;
}

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
