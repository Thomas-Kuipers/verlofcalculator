<script lang="ts" setup>
const titles = {
    'en': 'English',
    'nl': 'Dutch'
}
</script>

<template>
    <div :class="$style.container">
        <label>Language:</label>
        <select v-model="$i18n.locale" :class="$style.select">
            <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
                {{ titles[locale] || locale }}
            </option>
        </select>
    </div>
</template>

<style lang="scss" module>
.select {
    padding: 4px;
    margin-left: 8px;
    border-radius: 5px;
}
</style>