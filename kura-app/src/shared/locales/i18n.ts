import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as locales from './index';

i18n.use(initReactI18next).init({
  resources: locales.resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  react: {
    useSuspense: false, // For React Native compatibility
  },
  interpolation: {
    escapeValue: false, // React already prevents XSS
  },
});

export default i18n;
