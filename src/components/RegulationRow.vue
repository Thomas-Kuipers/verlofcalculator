<script lang="ts" setup>
import { Regulation, useLeaveStore } from '@/stores/leave'
import { ref } from 'vue'
import TextContent from '@/components/TextContent.vue'
import CaretDown from '@/assets/icons/caret-down.svg'

defineProps<{
    regulation: Regulation
}>()

const leaveStore = useLeaveStore()
const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value
</script>

<template>
    <tr>
        <td>
            <button :class="$style.expand" @click="toggle">
                <span>{{ regulation.title }}</span>
                <img :src="CaretDown" alt="Arrow down" :class="$style.caret" />
            </button>
        </td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, true) === regulation.daysOff }" v-if="regulation.mom">{{ leaveStore.daysUsedByRegulation(regulation.id, true) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.mom" :class="$style.na">N/A</td>
        <td :class="{[$style.days]: true, [$style.maxed]: leaveStore.daysUsedByRegulation(regulation.id, false) === regulation.daysOff }" v-if="regulation.secondParent">{{ leaveStore.daysUsedByRegulation(regulation.id, false) }} / {{ regulation.daysOff }}</td>
        <td v-if="!regulation.secondParent" :class="$style.na">N/A</td>
    </tr>
    <tr v-if="expanded">
        <td colspan="3" :class="$style.infoTd">
            <TextContent :class="$style.info">
                <p>Official title: {{ regulation.officialTitle }}</p>
                <ul>
                    <li v-for="line in regulation.description">{{ line }}</li>
                </ul>
                <p>More info on <a target="_blank" :href="regulation.url">rijksoverheid.nl</a></p>
            </TextContent>
        </td>
    </tr>
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';

.na {
    opacity: .3;
    background: #999;
}
tfoot td {
    border-top: 1px solid #ddd;
}

.days {
    background: #CFC;
}

.maxed {
    background: #FCC;
}

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
}

.caret {
    width: 30px;
    position: absolute;
    left: 100%;
    top: -6px;
}
</style>
