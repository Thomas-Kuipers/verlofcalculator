<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    value: number | null
    hideZero?: boolean
}>()

const formatted = computed(() => {
    if (props.value === null) {
        return ''
    }

    const formatter = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    })

    return formatter.format(props.value)
})
</script>

<template>
    <span v-if="value !== null && (value > 0 || !hideZero)">
        {{ formatted }}
    </span>
</template>

