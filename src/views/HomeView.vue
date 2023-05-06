<script lang="ts" setup>
import Calendar from '@/components/Calendar.vue'
import DaysUsage from '@/components/DaysUsage.vue'
import Presets from '@/components/Presets.vue'
import Analysis from '@/components/Analysis.vue'
import TextContent from '@/components/TextContent.vue'
import Financial from '@/components/Financial.vue'
</script>


<template>
	<div :class="$style.container">
        <header :class="$style.header">
            <TextContent>
                <h1>Parental leave calculator</h1>
            </TextContent>
        </header>
        <main :class="$style.main">
            <Calendar />
            <aside :class="$style.aside">
                <Presets />
                <table :class="$style.table">
                    <DaysUsage />
                    <tr>
                        <td colspan="3" :class="$style.spacer"></td>
                    </tr>
                    <Financial />
                </table>
                <Analysis />
                <TextContent>
                    <h2>Feedback</h2>
                    <p>Notice any mistakes? Any other ideas how to improve this further?</p>
                    <p>Email me at <a href="mailto:thomas@webvalid.nl">thomas@webvalid.nl</a></p>
                    <p>If you're a nerd, you can submit a pull request at <a href="https://github.com/Thomas-Kuipers/verlofcalculator">github.com/Thomas-Kuipers/verlofcalculator</a></p>
                </TextContent>
            </aside>
        </main>
	</div>
</template>

<style lang="scss" module>
.header {
    padding: 16px 16px 0;
}

.main {
	display: flex;
}


.table {
    margin-bottom: 24px;
    margin-right: 16px;
    width: calc(100% - 16px);

    th {
        font-weight: bold;
        white-space: nowrap;
    }

    td:first-child,
    th:first-child {
        width: 200px;
    }

    td,
    th {
        padding: 6px 24px 6px 0;
    }

    td:not(:first-child),
    th:not(:first-child){
        padding-left: 8px;
    }

    a {
        color: royalblue;
        text-decoration: underline;
    }
}

.aside {
    flex-grow: 1;
}

.spacer {
    height: 24px;
}
</style>
