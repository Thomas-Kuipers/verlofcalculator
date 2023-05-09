<script lang="ts" setup>
import { useLeaveStore } from '@/stores/leave'
import { computed } from 'vue'
import TextContent from '@/components/TextContent.vue'
import { translate } from '@/helpers/translate'

const leaveStore = useLeaveStore()

const daysOffMom = computed(() => leaveStore.totalDaysUsed(true))
const daysOffPartner = computed(() => leaveStore.totalDaysUsed(false))
const maxWidth = 300

const momFactor = computed(() => {
    const maxValue = Math.max(daysOffMom.value, daysOffPartner.value)
    return daysOffMom.value / maxValue
})

const widthMom = computed(() => Math.round(momFactor.value * maxWidth))

const partnerFactor = computed(() => {
    const maxValue = Math.max(daysOffMom.value, daysOffPartner.value)
    return daysOffPartner.value / maxValue
})

const widthPartner = computed(() =>  Math.round(partnerFactor.value * maxWidth))
const standardColor = '#cccccc'
const goodColor = '#6fde5b'
const color1 = 'f72020'
const color2 = 'ffb5bf'

const momColor = computed(() => {
    if (daysOffMom.value === daysOffPartner.value) {
        return goodColor
    }

    if (daysOffMom.value < daysOffPartner.value) {
        return standardColor
    }

    const more = daysOffMom.value - daysOffPartner.value
    const max = 40
    const ratio = Math.min(1, more / max)
    return getColor(color1, color2, ratio)
})

const partnerColor = computed(() => {
    if (daysOffMom.value === daysOffPartner.value) {
        return goodColor
    }

    if (daysOffPartner.value < daysOffMom.value) {
        return standardColor
    }

    const more = daysOffPartner.value - daysOffMom.value
    const max = 40
    const ratio = Math.min(1, more / max)
    return getColor(color1, color2, ratio)
})

function getColor(color1: string, color2: string, ratio: number) {
    var hex = function(x: any) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

    return '#' + hex(r) + hex(g) + hex(b);
}

const { t } = translate()
</script>

<template>
    <div :class="$style.container">
        <TextContent>
            <h2>{{ t('chartTitle') }}</h2>
        </TextContent>
        <ul>
            <li :class="$style.item">
                <div :class="$style.bar" :style="{ width: widthMom + 'px', background: momColor }" />
                <div :class="$style.value">{{ t('chartDaysMom', { days: daysOffMom }) }}</div>
            </li>
            <li :class="$style.item">
                <div :class="$style.bar" :style="{ width: widthPartner + 'px', background: partnerColor }" />
                <div :class="$style.value">{{ t('chartDaysPartner', { days: daysOffPartner }) }}</div>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" module>
.container {
    margin-bottom: 24px;
}

.item {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
}

.bar {
    height: 24px;
    margin-right: 8px;
}
</style>