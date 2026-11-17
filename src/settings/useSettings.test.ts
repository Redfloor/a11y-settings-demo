import {defaultSettings, migrateSettings, useSettingsStore} from './useSettings';

const saved = (): Record<string, unknown> => JSON.parse(localStorage.getItem('settingsState') ?? '{}');

describe('settings', () => {
    beforeEach(() => {
        useSettingsStore.setState(defaultSettings);
        localStorage.clear();
    });

    it('saves every change straight away, with no Save step', () => {
        useSettingsStore.getState().setTheme('highContrast');
        expect(saved()).toMatchObject({theme: 'highContrast'});

        useSettingsStore.getState().setFontSize('largeFonts');
        expect(saved()).toEqual({...defaultSettings, theme: 'highContrast', fontSize: 'largeFonts'});
    });

    it('saves the language with the other settings', () => {
        useSettingsStore.getState().setLanguage('af');
        expect(saved()).toMatchObject({language: 'af'});
    });

    it('stores only values, under one app-wide key', () => {
        useSettingsStore.getState().setSpeechControl(true);
        expect(Object.keys(localStorage)).toEqual(['settingsState']);
        expect(Object.keys(saved()).sort()).toEqual(Object.keys(defaultSettings).sort());
    });

    it('loads what was saved', () => {
        localStorage.setItem('settingsState', JSON.stringify({theme: 'light', language: 'af'}));
        useSettingsStore.getState().loadSettings();
        expect(useSettingsStore.getState()).toMatchObject({theme: 'light', language: 'af'});
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

        it("drops a language the app doesn't have, so the default applies", () => {
            expect(migrateSettings({language: 'fr', theme: 'light'})).toEqual({theme: 'light'});
            expect(migrateSettings({language: 'af'})).toEqual({language: 'af'});
        });
    });
});
