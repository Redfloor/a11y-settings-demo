import {createInstance} from 'i18next';
import {initReactI18next} from 'react-i18next';

import {useSettingsStore} from '../settings/useSettings';

import {resources} from './resources';

// The language is a setting like the others (saved with them in useSettings). i18next starts in the saved language
// and follows the setting from then on, so nothing calls i18n.changeLanguage directly.
const {language} = useSettingsStore.getState();

// The app's own instance; .use(initReactI18next) makes it the one useTranslation() reads.
const i18n = createInstance();

void i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: language,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes what it renders
        },
    });

// Keep <html lang> in step, so screen readers pronounce the page in the right language.
document.documentElement.lang = language;

useSettingsStore.subscribe((state, previous) => {
    if (state.language !== previous.language) {
        void i18n.changeLanguage(state.language);
        document.documentElement.lang = state.language;
    }
});

export {i18n};
