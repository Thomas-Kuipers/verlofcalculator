<script lang="ts" setup>
defineProps<{
    value: number
}>()
</script>

<template>
    {{ (Math.round(value * 10) / 10) }}
</template>