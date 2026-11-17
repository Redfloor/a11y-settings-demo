import {defaultSettings, migrateSettings, useSettingsStore} from './useSettings';

describe('settings', () => {
    beforeEach(() => {
        localStorage.clear();
        useSettingsStore.setState(defaultSettings);
    });

    it('saves only the setting values, and loads them back', () => {
        useSettingsStore.getState().setTheme('highContrast');
        useSettingsStore.getState().setFontSize('largeFonts');
        expect(useSettingsStore.getState().saveSettings()).toBe(true);

        expect(JSON.parse(localStorage.getItem('settingsState') ?? '{}')).toEqual({
            ...defaultSettings,
            theme: 'highContrast',
            fontSize: 'largeFonts',
        });

        useSettingsStore.setState(defaultSettings);
        useSettingsStore.getState().loadSettings();
        expect(useSettingsStore.getState().theme).toBe('highContrast');
        expect(useSettingsStore.getState().fontSize).toBe('largeFonts');
    });

    it('keeps the current settings when saved data is unreadable', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem('settingsState', '{not json');
        useSettingsStore.getState().loadSettings();
        expect(useSettingsStore.getState().theme).toBe(defaultSettings.theme);
        vi.restoreAllMocks();
    });

    describe('migrateSettings', () => {
        it('turns the old reduceAnimations flag into a motion preference', () => {
            expect(migrateSettings({reduceAnimations: true})).toEqual({motionPreference: 'reduced'});
            expect(migrateSettings({reduceAnimations: false})).toEqual({motionPreference: 'system'});
        });

        it('prefers a saved motion preference over the old flag', () => {
            expect(migrateSettings({reduceAnimations: true, motionPreference: 'full'})).toEqual({motionPreference: 'full'});
        });
    });
});
