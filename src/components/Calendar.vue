<script lang="ts" setup>
import { Preset, useLeaveStore } from '@/stores/leave'
import Week from '@/components/Week.vue'
import { translate } from '@/helpers/translate'
import TextContent from '@/components/TextContent.vue'

const leaveStore = useLeaveStore()
const { t } = translate()

function activate(preset: Preset) {
    leaveStore.weeks.forEach((week, i) => {
        leaveStore.setDays(i + 1, preset.mom[i] || 0, true)
        leaveStore.setDays(i + 1, preset.secondParent[i] || 0, false)
    })
}
</script>

<template>
    <div :class="$style.container">
        <TextContent>
            <h2>{{ t('calendarTitle') }}</h2>
        </TextContent>
        <div :class="$style.presets">
            <p>{{ t('examplesTitle') }}:</p>
            <button
                :class="$style.preset"
                @click="() => activate(preset)"
                v-for="preset in leaveStore.presets">
                {{ t(preset.title) }}
            </button>
        </div>

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
@use '@/assets/scss/variables.scss';

.container {
    margin: 0 16px 16px;
}

.presets {
    margin-bottom: 24px;
}

.preset {
    display: inline-block;
    border: 1px solid variables.$lightSeparator;
    margin: 0 4px 4px 0;
    padding: 2px 8px;
    border-radius: 5px;
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
