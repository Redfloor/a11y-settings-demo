import type {Language} from '../i18n/resources';

// The app's language code mapped to the BCP 47 tag speech recognition expects.
const recognitionLanguages: Record<Language, string> = {
    en: 'en-GB',
    af: 'af-ZA',
};

export const langSwitch = (lang: string): string =>
    lang in recognitionLanguages ? recognitionLanguages[lang as Language] : recognitionLanguages.en;
