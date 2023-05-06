<script setup lang="ts">
defineProps<{
    padding?: boolean
    extraPadding?: boolean
}>()
</script>

<template>
    <div :class="{ [$style.content]: true, [$style.padding]: padding, [$style.extraPadding]: extraPadding }">
        <slot />
    </div>
</template>

<style lang="scss" module>
@use '@/assets/scss/typography.scss';
@use '@/assets/scss/variables.scss';

.content {
    h1 {
        @include typography.largeTitle;
        margin-bottom: 1rem;
    }

    h2 {
        @include typography.title2;
        margin-bottom: 1rem;
    }

    h3 {
        @include typography.title3;
        margin-bottom: 1rem;
    }

    h4 {
        @include typography.headline;
    }

    p {
        margin-bottom: 16px;
    }

    ul,
    ol {
        margin-bottom: 16px;
        margin-top: 8px;
        list-style: disc;
    }

    ol {
        list-style: decimal;
    }

    li {
        margin-left: 20px;
        margin-bottom: 8px;
    }

    a {
        text-decoration: underline;
        color: variables.$green2;
    }
}

.padding {
    padding: 16px 16px 0 16px;
}

.extraPadding {
    padding: 0 24px;
}
</style>
