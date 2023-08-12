<script lang="ts" setup>

const props = defineProps<{
    active: number[]
}>()

const emit = defineEmits(['change'])

const options = [
    {
        value: 1,
        label: 'Monday'
    },
    {
        value: 2,
        label: 'Tuesday'
    },
    {
        value: 3,
        label: 'Wednesday'
    },
    {
        value: 4,
        label: 'Thursday'
    },
    {
        value: 5,
        label: 'Friday'
    },
]

function toggle(day: number) {
    if (props.active.includes(day)) {
        emit('change', props.active.filter(activeDays => activeDays !== day))
    } else {
        emit('change', props.active.concat(day))
    }
}
</script>

<template>
    <ul>
        <li v-for="option in options">
            <label>
                <input @change="() => toggle(option.value)" type="checkbox" :checked="active.includes(option.value)" />
                <span>{{ option.label }}</span>
            </label>
        </li>
    </ul>
</template>