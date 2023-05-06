<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import RegulationRow from '@/components/RegulationRow.vue'

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
    <RegulationRow
        v-for="regulation in leaveStore.regulations"
        :regulation="regulation"
    />
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
</style>
