import { createI18n } from 'vue-i18n'

import en from './locales/en'
import zh from './locales/zh'
import { Locale } from '~/enums'

const messages = { en, zh }

const [locale, fallbackLocale] = /^zh\b/.test(window.navigator.language)
  ? [Locale.ZH, Locale.EN]
  : [Locale.EN, Locale.ZH]

export default createI18n({
  locale,
  fallbackLocale,
  messages,
})
