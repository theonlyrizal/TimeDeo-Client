import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import bn from './locales/bn.json'

export const LANGS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'bn'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'timedeo-lang',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

function syncHtmlLang(lng) {
  if (typeof document !== 'undefined') document.documentElement.lang = lng
}

syncHtmlLang(i18n.resolvedLanguage || i18n.language || 'en')
i18n.on('languageChanged', syncHtmlLang)

export default i18n
