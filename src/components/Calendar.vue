<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import Week from '@/components/Week.vue'
import { translate } from '@/helpers/translate'
import TextContent from '@/components/TextContent.vue'

const leaveStore = useLeaveStore()
const { t } = translate()
</script>

<template>
    <div :class="$style.container">
        <TextContent>
            <h2>{{ t('calendarTitle') }}</h2>
        </TextContent>
        <table :class="$style.table">
            <thead>
            <tr>
                <th>{{ t('calendarThWeek') }}</th>
                <th>{{ t('calendarThDate') }}</th>
                <th>{{ t('calendarThDaysOffMom') }}</th>
                <th>{{ t('calendarThDaysOffPartner') }}</th>
                <th>{{ t('calendarThDaysChildcare') }}</th>
            </tr>
            </thead>
            <tbody>
            <Week
                v-for="(week, i) in leaveStore.weeks"
                :week="week"
                :n="i + 1"
            />
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" module>
.container {
    margin: 0 16px 16px;
}

.table {
    th {
        font-weight: bold;
        white-space: nowrap;
    }

    td,
    th {
        padding: 1px 16px 1px 0;
    }
}
</style>
