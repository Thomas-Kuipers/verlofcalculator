<script lang="ts" setup>
import Money from '@/components/Money.vue'
import Tooltip from '@/components/Tooltip.vue'
import { formatMoney } from '@/helpers/formatMoney'
import { computed } from 'vue'

const props = defineProps<{
    normalIncome: number | null
    missedIncome: number | null
    payout: number | null
    days: number
}>()

const tooltip = computed(() => {
    if (props.normalIncome !== null && props.payout !== null) {
        return `Missed income per day\n = normal income - payout\n = ${formatMoney(props.normalIncome)} - ${formatMoney(props.payout)}`
    }

    return 'Missed income per day'
})
</script>

<template>
    <td>
        <div :class="$style.container">
            <span>{{ days || 0 }}</span>
            <Tooltip :tooltip="tooltip">
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

