<script setup lang="ts">
import TextContent from '@/components/TextContent.vue'
</script>

<template>
    <tr>
        <td colspan="3" :class="$style.infoTd">
            <TextContent :class="$style.info">
                <slot />
            </TextContent>
        </td>
    </tr>
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';

.infoTd {
    padding: 0 !important;
}

.info {
    padding: 16px 16px 1px;
    margin-bottom: 24px;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
}
</style>
