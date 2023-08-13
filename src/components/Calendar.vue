<script lang="ts" setup>
import { CalendarBrushes, Preset, useLeaveStore } from '@/stores/leave'
import { translate } from '@/helpers/translate'
import TextContent from '@/components/TextContent.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CalendarDay from '@/components/CalendarDay.vue'

const leaveStore = useLeaveStore()
const { t } = translate()

interface Column {
    date: Date
    visible: boolean
}

const months = computed<Column[][][]>(() => {
    if (!leaveStore.personal.dueDate) {
        return []
    }

    const months = []
    for (let iMonth = 0; iMonth < 12; iMonth ++) {
        const currentMonth = leaveStore.personal.dueDate.getMonth() + iMonth
        const firstDayOfMonth = new Date(leaveStore.personal.dueDate.getFullYear(), currentMonth, 1)
        const prevMonday = new Date(firstDayOfMonth.getTime())
        prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7)

        let i = 0
        const weeks = []

        weekLoop:
        for (let iWeek = 0; iWeek < 6; iWeek ++) {
            const days = []

            for (let iDay = 0; iDay < 7; iDay ++) {
                const date = new Date(prevMonday.getTime())
                date.setDate(date.getDate() + i)
                i ++

                days.push({
                    date: date,
                    visible: date.getMonth() == firstDayOfMonth.getMonth(),
                })
            }

            weeks.push(days)

            const lastDay = days[days.length - 1]
            const nextDay = new Date(lastDay.date.getTime())
            nextDay.setDate(lastDay.date.getDate() + 1)

            if (nextDay.getMonth() !== firstDayOfMonth.getMonth()) {
                break weekLoop
            }
        }

        months.push(weeks)
    }

    return months
})

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

function changeDay(date: Date) {
    if (leaveStore.activeBrush === CalendarBrushes.eraser) {
        leaveStore.setDay(date, false, true)
        leaveStore.setDay(date, false, false)
    } else if (leaveStore.activeBrush === CalendarBrushes.mom) {
        leaveStore.setDay(date, true, true)
    } else if (leaveStore.activeBrush === CalendarBrushes.partner) {
        leaveStore.setDay(date, true, false)
    }
}

function onClick(date: Date, visible: boolean) {
    if (!visible) return
    changeDay(date)
}

function onMouseEnter(date: Date, visible: boolean) {
    if (!visible) return
    if (isMouseDown.value) {
        changeDay(date)
    }
}
</script>

<template>
    <div :class="$style.container" v-if="leaveStore.personal.dueDate">
        <TextContent>
            <h2>{{ t('calendarTitle') }}</h2>
        </TextContent>
        <p>
            <span :class="$style.brushIcon">🖌</span> Select a brush to draw on the calendar
        </p>
        <ul :class="$style.brushes">
            <li @click="() => leaveStore.setActiveBrush(CalendarBrushes.mom)" :class="{
            [$style.brush]: true,
            [$style.brushMom]: true,
            [$style.brushActive]: leaveStore.activeBrush === CalendarBrushes.mom
        }">Mom is home</li>
            <li @click="() => leaveStore.setActiveBrush(CalendarBrushes.partner)" :class="{
            [$style.brush]: true,
            [$style.brushPartner]: true,
            [$style.brushActive]: leaveStore.activeBrush === CalendarBrushes.partner
        }">Partner is home</li>
            <li @click="() => leaveStore.setActiveBrush(CalendarBrushes.eraser)" :class="{
            [$style.brush]: true,
            [$style.brushEraser]: true,
            [$style.brushActive]: leaveStore.activeBrush === CalendarBrushes.eraser
        }">Eraser</li>
        </ul>
        <table :class="{
        [$style.table]: true,
        [$style.tableWithMomBrush]: leaveStore.activeBrush === CalendarBrushes.mom,
        [$style.tableWithPartnerBrush]: leaveStore.activeBrush === CalendarBrushes.partner,
        [$style.tableWithEraserBrush]: leaveStore.activeBrush === CalendarBrushes.eraser,
    }">
            <template v-for="month in months">
                <thead>
                <tr>
                    <th colspan="6" :class="$style.monthHeader">
                        {{ month[2][0].date.toLocaleString('default', { month: 'long' }) }}
                    </th>
                </tr>
                <tr>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th :class="$style.weekend">Sat</th>
                    <th :class="$style.weekend">Sun</th>
                </tr>
                </thead>
                <tr v-for="week in month">
                    <td v-for="day in week"
                        @mouseenter="() => onMouseEnter(day.date, day.visible)"
                        @mousedown="() => onClick(day.date, day.visible)"
                        :class="{[$style.dayColumn]: true}">
                        <CalendarDay :date="day.date" :visible="day.visible" />
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>

<style lang="scss" module>
@use '@/assets/scss/variables.scss';

.container {
    margin: 0 16px 16px;
}

.presets {
    margin-bottom: 24px;
}

.preset {
    display: inline-block;
    border: 1px solid variables.$lightSeparator;
    margin: 0 4px 4px 0;
    padding: 2px 8px;
    border-radius: 5px;
}

.weekend {
    opacity: .3;
}

.table {
    user-select: none;

    .monthHeader {
        text-align: center;
        padding: 30px 0 10px;
        font-size: 18px;
        font-weight: bold;
    }

    th {
        white-space: nowrap;
    }

    td,
    th {
        padding: 10px;
        text-align: center;
    }
}


.brushIcon {
    font-size: 25px;
    display: inline-block;
    transform: translateY(5px);
}

.brushes {
    display: flex;
    margin: 10px 0;
}

.brush {
    margin-right: 10px;
    padding: 5px 10px;
    border-radius: 30px;
    cursor: pointer;
    border: 1px solid transparent;
}

.brushMom {
    color: white;
    background: deeppink;
}

.brushPartner {
    color: white;
    background: dodgerblue;
}

.brushEraser {
    border-color: #cccccc;
}

.brushActive {
    box-shadow: 2px 2px 10px 4px rgba(0,0,0,0.2);
}

.dayColumn {
    &:hover {
        background: #eee;
        border-radius: 50%;
    }
}

.tableWithMomBrush {
    cursor: url(~@/assets/icons/circle-pink.svg), auto;
}

.tableWithPartnerBrush {
    cursor: url(~@/assets/icons/circle-blue.svg), auto;
}

.tableWithEraserBrush {
    cursor: url(~@/assets/icons/circle-eraser.svg), auto;
}
</style>
