<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import { onMounted, onUnmounted, ref } from 'vue'

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
        leaveStore.setDays(props.weekNumber, option, props.mom)
    }
}
</script>

<template>
	<div :class="$style.container">
		<button
			v-for="option in options"
			:disabled="minimumDays && option < minimumDays"
			:class="{[$style.button]: true, [$style.active]: days === option}"
            @mouseenter="() => onMouseEnter(option)"
			@mousedown="() => leaveStore.setDays(weekNumber, option, mom)">
			{{ option }}
		</button>
	</div>
</template>

<style lang="scss" module>
.container {
	display: flex;
}

.button {
	border-radius: 4px;
	background: #eee;
	cursor: pointer;
	text-align: center;
	width: 30px;
	line-height: 30px;
	border: none;
	margin-right: 2px;

	&:disabled {
		background: #ccc;
		cursor: not-allowed;
	}
}

.active {
	background: royalblue;
	color: white;
}
</style>
