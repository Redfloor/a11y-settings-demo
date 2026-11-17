import af from './locales/af.json';
import en from './locales/en.json';

// One JSON file per language, all in the default `translation` namespace. Keys are the English text for short
// labels ("Theme") and dotted names for longer or grouped strings ("Motion.label", "preview.body").
export const resources = {
    en: {translation: en},
    af: {translation: af},
};

export type Language = keyof typeof resources;

// Each language is listed by its own name, so a player who can't read the current language can still find theirs.
const languageNames: Record<Language, string> = {
    en: 'English',
    af: 'Afrikaans',
};

export const languages = (Object.keys(resources) as Language[]).map((value) => ({value, name: languageNames[value]}));

export const isLanguage = (value: string): value is Language => value in resources;
