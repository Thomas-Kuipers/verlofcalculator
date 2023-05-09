<script lang="ts" setup>
import TextContent from '@/components/TextContent.vue'
import { useLeaveStore } from '@/stores/leave'
import { translate } from '@/helpers/translate'

const leaveStore = useLeaveStore()
const { t } = translate()
</script>

<template>
    <div :class="$style.container">
        <TextContent>
            <h2>{{ t('settingsTitle') }}</h2>
        </TextContent>
        <ul :class="$style.list">
            <li :class="$style.item">
                <label :class="$style.label">{{ t('setDueDate') }}</label>
                <input
                    type="date"
                    @change="event => leaveStore.setDueDate(new Date(event.currentTarget.value))"
                />
            </li>
            <li :class="$style.item">
                <label :class="$style.label">{{ t('settingsGrossYearlySalaryMom') }}</label>
                <input
                    :class="$style.salaryInput"
                    type="number"
                    @keyup="event => leaveStore.setGrossYearlySalary(parseInt(event.currentTarget.value), true)"
                />
            </li>
            <li :class="$style.item">
                <label :class="$style.label">{{ t('settingsGrossYearlySalaryPartner') }}</label>
                <input
                    :class="$style.salaryInput"
                    type="number"
                    @keyup="event => leaveStore.setGrossYearlySalary(parseInt(event.currentTarget.value), false)"
                />
            </li>
        </ul>

    </div>
</template>

<style lang="scss" module>
.container {
    margin-bottom: 8px;
    padding: 0 16px;
}

.list {
    display: flex;
    flex-wrap: wrap;
}

.item {
    margin: 0 16px 16px 0;
}

.label {
    display: block;
}
</style>