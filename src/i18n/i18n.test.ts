import {defaultSettings, useSettingsStore} from '../settings/useSettings';

import {i18n} from './i18n';

describe('i18n and the language setting', () => {
    afterEach(() => {
        useSettingsStore.setState(defaultSettings);
        localStorage.clear();
    });

    it('switches the language when the setting changes', () => {
        useSettingsStore.getState().setLanguage('af');
        expect(i18n.language).toBe('af');
        expect(i18n.t('settingsPageTitle')).toBe('Instellings');
        expect(document.documentElement.lang).toBe('af');
    });

    it('starts in the saved language', async () => {
        localStorage.setItem('settingsState', JSON.stringify({language: 'af'}));
        vi.resetModules();
        const {i18n: fresh} = await import('./i18n');
        expect(fresh.language).toBe('af');
        expect(fresh.t('Theme')).toBe('Tema');
    });
});
