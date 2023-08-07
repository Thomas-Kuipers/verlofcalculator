<script lang="ts" setup>
import { computed } from 'vue'
import { formatMoney } from '@/helpers/formatMoney'

const props = defineProps<{
    value: number | null
    estimate?: boolean
    hideZero?: boolean
}>()

const formatted = computed(() => {
    if (props.estimate && props.value !== null) {
        return '~ ' + formatMoney(Math.round(props.value / 100) * 100)
    }

    return formatMoney(props.value)
})
</script>

<template>
    <span v-if="value !== null && (value > 0 || !hideZero)">
        {{ formatted }}
    </span>
</template>

