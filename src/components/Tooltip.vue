<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
    tooltip?: string
}>()

const target = ref<HTMLDivElement>()
const visible = ref(false)
const position = ref({ x: 0, y: 0})

function onMouseEnter() {
    if (target.value) {
        visible.value = true
        const rect = target.value.getBoundingClientRect()
        position.value = {
            x: rect.left + (rect.width / 2),
            y: rect.top + window.scrollY
        }
    }
}

function onMouseLeave() {
    visible.value = false
}

</script>

<template>
    <Teleport to="body">
        <div
            v-if="visible"
            :style="{ left: position.x + 'px', top: position.y + 'px' }"
            :class="$style.tooltip" >
            <slot v-if="!tooltip" name="tooltip" />
            <span v-if="tooltip">{{ tooltip }}</span>
        </div>
    </Teleport>
    <div
        ref="target"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        :class="$style.container">
        <slot />
    </div>
</template>

<style lang="scss" module>
@use '@/assets/scss/variables.scss';

.container {
    display: inline-block;
}

.tooltip {
    position: absolute;
    transform: translateX(-50%) translateY(calc(-100% - 4px));
    background: white;
    border: 1px solid variables.$lightSeparator;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
    border-radius: variables.$borderRadius300;
    padding: 8px;
    z-index: 9999;
    max-width: 400px;
}
</style>