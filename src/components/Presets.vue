<script lang="ts" setup>
import { Preset, useLeaveStore } from '@/stores/leave'
import TextContent from '@/components/TextContent.vue'

const leaveStore = useLeaveStore()

function activate(preset: Preset) {
	leaveStore.weeks.forEach((week, i) => {
		leaveStore.setDays(i + 1, preset.mom[i] || 0, true)
		leaveStore.setDays(i + 1, preset.secondParent[i] || 0, false)
	})
}

</script>

<template>
	<div :class="$style.container">
        <TextContent>
            <h2>Examples</h2>
        </TextContent>

		<button
			:class="$style.preset"
			@click="() => activate(preset)"
			v-for="preset in leaveStore.presets">
			{{ preset.title }}
		</button>
	</div>
</template>

<style lang="scss" module>
@use '@/assets/scss/variables.scss';

.container {
    margin-bottom: 24px;
}

.preset {
	border-radius: 4px;
	margin: 0 5px 5px 0;
	padding: 4px 8px;
	cursor: pointer;
    border: 1px solid variables.$lightSeparator
}
</style>
