<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import RegulationRow from '@/components/RegulationRow.vue'
import { translate } from '@/helpers/translate'

const leaveStore = useLeaveStore()
const { t } = translate()
</script>

<template>
    <tr>
        <td colspan="3">
            <h2 :class="$style.title">{{ t('regulationsTitle') }}</h2>
        </td>
    </tr>
    <tr>
        <th />
        <th :class="$style.column2">{{ t('regulationsThMom') }}</th>
        <th :class="$style.column2">{{ t('regulationsThPartner') }}</th>
    </tr>
    <RegulationRow
        v-for="regulation in leaveStore.regulations"
        :regulation="regulation"
    />
    <tr>
        <td>{{ t('regulationsTotalDaysOff') }}</td>
        <td :class="{[$style.maxedOut]: leaveStore.totalDaysUsed(true) > leaveStore.totalDaysOffAvailableMom }">{{ leaveStore.totalDaysUsed(true) }} / {{ leaveStore.totalDaysOffAvailableMom }}</td>
        <td :class="{[$style.maxedOut]: leaveStore.totalDaysUsed(false) > leaveStore.totalDaysOffAvailablePartner }">{{ leaveStore.totalDaysUsed(false) }} / {{ leaveStore.totalDaysOffAvailablePartner }}</td>
    </tr>
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';

.title {
    @include typography.title2;
}

.column2,
.column3 {
    width: 150px;
}

.maxedOut {
    background: #f72020;
    color: white;
}
</style>
