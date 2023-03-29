import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from './locales/ru/translation'

i18n
  .use(initReactI18next) 
  .init({
    fallbackLng: 'ru',
    resources: {
      ru
    },
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;