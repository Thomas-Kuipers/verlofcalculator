<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import { onMounted, onUnmounted, ref } from 'vue'
import Tooltip from '@/components/Tooltip.vue'
import { translate } from '@/helpers/translate'

const props = defineProps<{
	weekNumber: number
	days: number
	minimumDays: number | null
	mom: boolean
}>()

const leaveStore = useLeaveStore()
const options = Array.from(Array(6).keys())
const isMouseDown = ref<boolean>(false)

function onMouseDown() {
    isMouseDown.value = true
}

function onMouseUp() {
    isMouseDown.value = false
}

onMounted(() => {
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
    window.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mouseup', onMouseUp)
})

function onMouseEnter(option: number) {
    if (isMouseDown.value) {
        leaveStore.setDragged()
        leaveStore.setDays(props.weekNumber, option, props.mom)
    }
}

const { t } = translate()
</script>

<template>
	<div :class="$style.container">
        <button
            v-for="option in options"
            :disabled="minimumDays && option < minimumDays"
            :class="$style.button"
            @mouseenter="() => onMouseEnter(option)"
            @mousedown="() => leaveStore.setDays(weekNumber, option, mom)">
            <Tooltip :tooltip="t('clickDrag')" v-if="!leaveStore.hasDragged && !(minimumDays && option < minimumDays)">
                <span :class="{[$style.buttonContent]: true, [$style.active]: days === option}">
                    {{ option }}
                </span>
            </Tooltip>
            <span v-else :class="{[$style.buttonContent]: true, [$style.active]: days === option}">
                {{ option }}
            </span>
        </button>
	</div>
</template>

<style lang="scss" module>
.container {
	display: flex;
}

.button {
    cursor: pointer;
	text-align: center;
	width: 30px;
	border: none;
	margin-right: 2px;

	&:disabled {
		cursor: not-allowed;

        .buttonContent {
            background: #ccc;
        }
	}
}

.buttonContent {
    width: 30px;
    line-height: 30px;
    display: block;
    background: #eee;
    border-radius: 4px;
}

.active {
	background: royalblue;
	color: white;
}
</style>
