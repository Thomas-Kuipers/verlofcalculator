import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@/assets/scss/reset.scss'
import '@/assets/scss/global.scss'
import { createI18n } from 'vue-i18n'
import english from '@/translations/en.json'
import dutch from '@/translations/nl.json'

export type MessageSchema = typeof english

function initialLocale() {
	if (window.navigator.language.startsWith('nl')) {
		return 'nl'
	} else {
		return 'en'
	}
}

export const i18n = createI18n<[MessageSchema], 'en' | 'nl'>({
	locale: initialLocale(),
	legacy: false,
	warnHtmlMessage: false,
	warnHtmlInMessage: 'off',
	messages: {
		en: english,
		nl: dutch,
	}
})

const pinia = createPinia()

createApp(App)
	.use(pinia)
	.use(router)
	.use(i18n)
	.mount('#app')
