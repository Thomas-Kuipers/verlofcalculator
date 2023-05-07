<script setup lang="ts">
import TextContent from '@/components/TextContent.vue'
import { ref } from 'vue'
import CaretDown from '@/assets/icons/caret-down.svg'

defineProps<{
    title: string
}>()

const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value
</script>

<template>
    <tr>
        <td>
            <button :class="$style.expand" @click="toggle">
                <span>{{ title }}</span>
                <img :src="CaretDown" alt="Arrow down" :class="$style.caret" />
            </button>
        </td>
        <slot />
    </tr>
    <tr v-if="expanded">
        <td colspan="3" :class="$style.infoTd">
            <TextContent :class="$style.info">
                <slot name="info" />
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

.expand {
    position: relative;
    text-decoration: underline;
    width: 100%;
    text-align: left;
    padding-right: 30px;
}

.caret {
    width: 30px;
    position: absolute;
    right: 0;
    top: -6px;
}
</style>
