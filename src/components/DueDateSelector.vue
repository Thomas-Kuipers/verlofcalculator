<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import Tooltip from '@/components/Tooltip.vue'
import { translate } from '@/helpers/translate'

const leaveStore = useLeaveStore()
const { t } = translate()
</script>

<template>
	<div :class="$style.container">
        <Tooltip :tooltip="t('setDueDate')">
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
