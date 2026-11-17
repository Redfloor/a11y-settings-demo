import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import {resources} from './resources';

void i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes what it renders
        },
    });

// Keep <html lang> in step, so screen readers pronounce the page in the right language.
document.documentElement.lang = i18n.language;
i18n.on('languageChanged', (language) => {
    document.documentElement.lang = language;
});

export {i18n};
