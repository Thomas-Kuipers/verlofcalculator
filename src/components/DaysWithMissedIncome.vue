<script lang="ts" setup>
import Money from '@/components/Money.vue'
import Tooltip from '@/components/Tooltip.vue'
import Days from '@/components/Days.vue'

const props = defineProps<{
    missedIncome: number | null
    days: number
}>()
</script>

<template>
    <td>
        <div :class="$style.container">
            <span><Days :value="days || 0" /></span>
            <Tooltip tooltip="Missed income per day">
                <Money hide-zero :value="missedIncome" />
            </Tooltip>
        </div>
    </td>
</template>

<style lang="scss" module>
.container {
    display: flex;
    justify-content: space-between;
}
</style>

