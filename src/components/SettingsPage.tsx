import {ReactNode, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {styled} from 'styled-components';

import {isLanguage, languages} from '../i18n/resources';
import {isMotionPreference, motionPreferences} from '../motion/motionPreference';
import {FontSize, Theme, useSettingsStore} from '../settings/useSettings';
import {getSpeechRecognition} from '../speech/useSpeechControl';

import {Button} from './Button';

const themes: readonly {value: Theme; label: string}[] = [
    {value: 'light', label: 'Light'},
    {value: 'dark', label: 'Dark'},
    {value: 'highContrast', label: 'High Contrast'},
    {value: 'protanopia', label: 'Protanopia'},
    {value: 'deuteranopia', label: 'Deuteranopia'},
    {value: 'tritanopia', label: 'Tritanopia'},
    {value: 'achromatopsia', label: 'Achromatopsia'},
];

const StyledOption = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-2);
    margin: var(--spacing-3) 0;
`;

const StyledHint = styled.p`
    flex-basis: 100%;
    color: var(--text-color-alt);
    font-size: var(--font-size-small);
    line-height: var(--line-height-small);
    margin: 0;
`;

/** Every setting here takes effect as soon as it changes. Save keeps them for next time. */
export const SettingsPage = (): ReactNode => {
    const {t, i18n} = useTranslation();
    const {
        theme, setTheme,
        spacing, setSpacing,
        fontSize, setFontSize,
        speechControl, setSpeechControl,
        motionPreference, setMotionPreference,
        saveSettings,
    } = useSettingsStore();
    const [saveMessage, setSaveMessage] = useState('');
    const speechSupported = getSpeechRecognition() !== undefined;

    return (
        <section aria-labelledby="settings-title">
            <h1 id="settings-title">{t('settingsPageTitle')}</h1>

            <StyledOption>
                <label htmlFor="language">{t('Language')}</label>
                <select
                    id="language"
                    value={i18n.language}
                    onChange={(e) => {
                        if (isLanguage(e.target.value)) void i18n.changeLanguage(e.target.value);
                    }}
                >
                    {languages.map((lang) => (
                        // Each language in its own name and language, so screen readers pronounce it properly.
                        <option key={lang.value} value={lang.value} lang={lang.value}>{lang.name}</option>
                    ))}
                </select>
            </StyledOption>

            <StyledOption>
                <label htmlFor="theme">{t('Theme')}</label>
                <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                    {themes.map(({value, label}) => <option key={value} value={value}>{t(label)}</option>)}
                </select>
            </StyledOption>

            <StyledOption>
                <input
                    id="spacing"
                    type="checkbox"
                    checked={spacing === 'largeSpacing'}
                    onChange={() => setSpacing(spacing === 'normalSpacing' ? 'largeSpacing' : 'normalSpacing')}
                />
                <label htmlFor="spacing">{t('Accessible Spacing')}</label>
            </StyledOption>

            <StyledOption>
                <label htmlFor="font-size">{t('Font Size')}</label>
                <select id="font-size" value={fontSize} onChange={(e) => setFontSize(e.target.value as FontSize)}>
                    <option value="normalFonts">{t('Normal')}</option>
                    <option value="largeFonts">{t('Large')}</option>
                </select>
            </StyledOption>

            <StyledOption>
                <label htmlFor="motion-preference">{t('Motion.label')}</label>
                <select
                    id="motion-preference"
                    value={motionPreference}
                    onChange={(e) => {
                        if (isMotionPreference(e.target.value)) setMotionPreference(e.target.value);
                    }}
                >
                    {motionPreferences.map((preference) => (
                        <option key={preference} value={preference}>{t(`Motion.${preference}`)}</option>
                    ))}
                </select>
            </StyledOption>

            <StyledOption>
                <input
                    id="speech-control"
                    type="checkbox"
                    checked={speechControl}
                    disabled={!speechSupported}
                    {...(speechSupported ? {} : {'aria-describedby': 'speech-unsupported'})}
                    onChange={() => setSpeechControl(!speechControl)}
                />
                <label htmlFor="speech-control">{t('Speech Control')}</label>
                {!speechSupported && <StyledHint id="speech-unsupported">{t('speechControl.unsupported')}</StyledHint>}
            </StyledOption>

            <StyledOption>
                <Button label={t('Save')} onClick={() => setSaveMessage(saveSettings() ? t('saved') : '')}/>
                {/* Announced by screen readers without moving focus. */}
                <span role="status">{saveMessage}</span>
            </StyledOption>
        </section>
    );
};
