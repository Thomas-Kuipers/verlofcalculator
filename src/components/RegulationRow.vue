<script lang="ts" setup>
import { Regulation, useLeaveStore } from '@/stores/leave'
import { ref } from 'vue'
import TextContent from '@/components/TextContent.vue'
import CaretDown from '@/assets/icons/caret-down.svg'
import RowInfo from '@/components/RowInfo.vue'

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
    <RowInfo v-if="expanded">
        <p>Official title: {{ regulation.officialTitle }}</p>
        <ul>
            <li v-for="line in regulation.description">{{ line }}</li>
        </ul>
        <p>More info on <a target="_blank" :href="regulation.url">rijksoverheid.nl</a></p>
    </RowInfo>
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

.expand {
    position: relative;
    text-decoration: underline;
}

.caret {
    width: 30px;
    position: absolute;
    left: 100%;
    top: -6px;
}
</style>
