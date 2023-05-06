import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@/assets/scss/reset.scss'
import '@/assets/scss/global.scss'

const pinia = createPinia()

createApp(App)
	.use(pinia)
	.use(router)
	.mount('#app')
