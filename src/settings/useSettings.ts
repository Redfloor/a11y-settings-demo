import {create} from 'zustand';

import {isLanguage, Language} from '../i18n/resources';
import {isMotionPreference, MotionPreference} from '../motion/motionPreference';

// App-wide settings, not game state: they apply whichever save is loaded, and are stored on their own key, apart from
// any per-character saves. Every change takes effect and is saved straight away.

export type Theme = 'light' | 'dark' | 'highContrast' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type FontSize = 'normalFonts' | 'largeFonts';
export type Spacing = 'normalSpacing' | 'largeSpacing';

export interface SettingsValues {
    language: Language;
    theme: Theme;
    spacing: Spacing;
    fontSize: FontSize;
    // Full control by voice, so the game can be played without a keyboard or mouse.
    speechControl: boolean;
    motionPreference: MotionPreference;
}

interface SettingsState extends SettingsValues {
    setLanguage: (language: Language) => void;
    setTheme: (theme: Theme) => void;
    setSpacing: (spacing: Spacing) => void;
    setFontSize: (fontSize: FontSize) => void;
    setSpeechControl: (enabled: boolean) => void;
    setMotionPreference: (preference: MotionPreference) => void;
    loadSettings: () => void;
}

const STORAGE_KEY = 'settingsState';

export const defaultSettings: SettingsValues = {
    language: 'en',
    theme: 'dark',
    spacing: 'normalSpacing',
    fontSize: 'normalFonts',
    speechControl: false,
    motionPreference: 'system',
};

/**
 * Makes saved settings fit the current ones:
 * - From before the motion setting stored a boolean `reduceAnimations` instead: true becomes 'reduced', false
 *   becomes 'system' (follow the operating system).
 * - A language the app no longer has is dropped, so the default applies.
 */
export const migrateSettings = (saved: Record<string, unknown>): Partial<SettingsValues> => {
    const {reduceAnimations, motionPreference, language, ...rest} = saved;
    const migrated: Record<string, unknown> = {...rest};
    if (typeof language === 'string' && isLanguage(language)) {
        migrated['language'] = language;
    }
    if (isMotionPreference(motionPreference)) {
        migrated['motionPreference'] = motionPreference;
    } else if (typeof reduceAnimations === 'boolean') {
        migrated['motionPreference'] = reduceAnimations ? 'reduced' : 'system';
    }
    return migrated as Partial<SettingsValues>;
};

const valuesOf = (state: SettingsValues): SettingsValues => ({
    language: state.language,
    theme: state.theme,
    spacing: state.spacing,
    fontSize: state.fontSize,
    speechControl: state.speechControl,
    motionPreference: state.motionPreference,
});

const saveSettings = (state: SettingsValues): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(valuesOf(state)));
    } catch (error) {
        // Storage can be full or blocked (a private window). The settings still apply until the page closes.
        console.error('Failed to save settings:', error);
    }
};

export const useSettingsStore = create<SettingsState>((set) => ({
    ...defaultSettings,
    setLanguage: (language) => set({language}),
    setTheme: (theme) => set({theme}),
    setSpacing: (spacing) => set({spacing}),
    setFontSize: (fontSize) => set({fontSize}),
    setSpeechControl: (enabled) => set({speechControl: enabled}),
    setMotionPreference: (preference) => set({motionPreference: preference}),
    loadSettings: () => {
        try {
            set(migrateSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')));
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    },
}));

useSettingsStore.getState().loadSettings();
// Subscribed after loading, so loading doesn't write straight back.
useSettingsStore.subscribe(saveSettings);
