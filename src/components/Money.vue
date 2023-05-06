<script lang="ts" setup>
import { computed } from 'vue'
import { formatMoney } from '@/helpers/formatMoney'

const props = defineProps<{
    value: number | null
    hideZero?: boolean
}>()

const formatted = computed(() => formatMoney(props.value))
</script>

<template>
    <span v-if="value !== null && (value > 0 || !hideZero)">
        {{ formatted }}
    </span>
</template>

