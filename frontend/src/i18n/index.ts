// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import it from './locales/it.json';
import en from './locales/en.json';
import de from './locales/de.json';

import zh from './locales/zh.json';
import ja from './locales/ja.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            it: { translation: it },
            en: { translation: en },
            de: { translation: de },
            zh: { translation: zh },
            ja: { translation: ja },
            fr: { translation: fr },
            es: { translation: es },
            pt: { translation: pt },
        },
        fallbackLng: 'en',
        interpolation: { escapeValue: false }, // React già fa escaping
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
    });

export default i18n;