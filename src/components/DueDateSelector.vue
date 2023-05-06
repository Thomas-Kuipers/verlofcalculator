<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import Tooltip from '@/components/Tooltip.vue'

const leaveStore = useLeaveStore()
</script>

<template>
	<div :class="$style.container">
        <Tooltip tooltip="Set your due date">
            <input
                type="date"
                @change="event => leaveStore.setDueDate(new Date(event.currentTarget.value))"
            />
        </Tooltip>
	</div>
</template>

<style lang="scss" module>
.container {

}
</style>
