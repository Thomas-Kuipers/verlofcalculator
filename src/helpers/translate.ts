import { useI18n } from 'vue-i18n'
import { MessageSchema } from '@/main'

export function translate() {
    const { t } = useI18n()

    return {
        t: (key: keyof MessageSchema, params: { [key: string]: string | number } = {}) => t(key, params)
    }
}
