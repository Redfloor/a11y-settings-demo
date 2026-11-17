import {create} from 'zustand';

import {isMotionPreference, MotionPreference} from '../motion/motionPreference';

// App settings, not game state: they apply across every save. Changes take effect at once and are kept for next
// time when the player presses Save.

export type Theme = 'light' | 'dark' | 'highContrast' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type FontSize = 'normalFonts' | 'largeFonts';
export type Spacing = 'normalSpacing' | 'largeSpacing';

export interface SettingsValues {
    theme: Theme;
    spacing: Spacing;
    fontSize: FontSize;
    // Full control by voice, so the game can be played without a keyboard or mouse.
    speechControl: boolean;
    motionPreference: MotionPreference;
}

interface SettingsState extends SettingsValues {
    setTheme: (theme: Theme) => void;
    setSpacing: (spacing: Spacing) => void;
    setFontSize: (fontSize: FontSize) => void;
    setSpeechControl: (enabled: boolean) => void;
    setMotionPreference: (preference: MotionPreference) => void;
    saveSettings: () => boolean;
    loadSettings: () => void;
}

const STORAGE_KEY = 'settingsState';

export const defaultSettings: SettingsValues = {
    theme: 'dark',
    spacing: 'normalSpacing',
    fontSize: 'normalFonts',
    speechControl: false,
    motionPreference: 'system',
};

/**
 * Saved settings from before the motion setting stored a boolean `reduceAnimations` instead:
 * true becomes 'reduced', false becomes 'system' (follow the operating system).
 */
export const migrateSettings = (saved: Record<string, unknown>): Partial<SettingsValues> => {
    const {reduceAnimations, motionPreference, ...rest} = saved;
    const migrated: Record<string, unknown> = {...rest};
    if (isMotionPreference(motionPreference)) {
        migrated['motionPreference'] = motionPreference;
    } else if (typeof reduceAnimations === 'boolean') {
        migrated['motionPreference'] = reduceAnimations ? 'reduced' : 'system';
    }
    return migrated as Partial<SettingsValues>;
};

const valuesOf = (state: SettingsState): SettingsValues => ({
    theme: state.theme,
    spacing: state.spacing,
    fontSize: state.fontSize,
    speechControl: state.speechControl,
    motionPreference: state.motionPreference,
});

export const useSettingsStore = create<SettingsState>((set, get) => ({
    ...defaultSettings,
    setTheme: (theme) => set({theme}),
    setSpacing: (spacing) => set({spacing}),
    setFontSize: (fontSize) => set({fontSize}),
    setSpeechControl: (enabled) => set({speechControl: enabled}),
    setMotionPreference: (preference) => set({motionPreference: preference}),
    saveSettings: () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(valuesOf(get())));
            return true;
        } catch (error) {
            // Storage can be full or blocked (a private window). The settings still apply until the page closes.
            console.error('Failed to save settings:', error);
            return false;
        }
    },
    loadSettings: () => {
        try {
            set(migrateSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')));
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    },
}));

useSettingsStore.getState().loadSettings();
