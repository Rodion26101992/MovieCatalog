import { useState, useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import i18n from '../locales/i18';

export const useTranslation = () => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    const locales = RNLocalize.getLocales();
    i18n.locale = locales[0]?.languageCode || 'en';
    setLocale(i18n.locale);
  }, []);

  const t = (key: string, options?: any) => {
    return i18n.t(key, options);
  };

  const changeLanguage = (languageCode: string) => {
    i18n.locale = languageCode;
    setLocale(languageCode);
  };

  return {
    t,
    locale,
    changeLanguage,
    availableLanguages: Object.keys(i18n.translations),
  };
};