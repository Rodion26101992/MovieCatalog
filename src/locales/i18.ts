import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import en from './en';
import ru from './ru';
// import es from './es';
// import fr from './fr';
// import de from './de';
// import it from './it';
// import pt from './pt';
// import ja from './ja';
// import ko from './ko';
// import zh from './zh';

const locales = RNLocalize.getLocales();

const i18n = new I18n({
  en,
  ru,
});

i18n.defaultLocale = 'en';
i18n.locale = locales[0]?.languageCode || 'en';
i18n.enableFallback = true;

export default i18n;