<script lang="ts" setup>

import { DayTypes, useLeaveStore } from '@/stores/leave'
import { computed } from 'vue'

const props = defineProps<{
    date: Date,
    visible: boolean
}>()

const leaveStore = useLeaveStore()

const dayTypeMom = computed(() => leaveStore.isDayOff(true, props.date))
const dayTypePartner = computed(() => leaveStore.isDayOff(false, props.date))
const isDueDate = computed(() => props.date.getDate() === leaveStore.personal.dueDate!!.getDate() && props.date.getMonth() === leaveStore.personal.dueDate!!.getMonth())

</script>
<template>
    <span
        :class="{
            [$style.day]: true,
            [$style.dayOffMom]: (dayTypeMom === DayTypes.ParentalLeave || dayTypeMom === DayTypes.PartTimer) && !isDueDate,
        }"
        v-if="visible">
        <span :class="$style.dueDate" v-if="isDueDate">
            🥳
        </span>
        <span v-else :class="{[$style.weekend]: date.getDay() === 6 || date.getDay() === 0}">
            {{ date.getDate() }}
        </span>
        <span
            :class="$style.dayOffPartner"
            v-if="(dayTypePartner === DayTypes.ParentalLeave || dayTypePartner === DayTypes.PartTimer) && !isDueDate"
        />
    </span>
</template>

<style lang="scss" module>
@use '@/assets/scss/variables.scss';


.day {
    //border-radius: 100%;
    display: inline-block;
    width: 29px;
    height: 29px;
    text-align: center;
    line-height: 25px;
    position: relative;
}

.dayOffMom {
    border-bottom: 4px solid deeppink;
}

.dayOffPartner {
    //border-radius: 100%;
    display: inline-block;
    width: 100%;
    height: 100%;
    border-bottom: 4px solid dodgerblue;
    position: absolute;
    top: -1px;
    left: 0;
}


.dueDate {
    font-size: 30px;
    position: relative;
    display: inline-block;
    transform: translateY(7px);
}

.weekend {
    opacity: .3;
}


</style>