import {useEffect, useEffectEvent, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {definedProps} from '../definedProps';
import {useSettingsStore} from '../settings/useSettings';

import {langSwitch} from './langSwitch';

export interface SpeechControl {
    speechControl: boolean;
    speechControlText: string;
    /** The last phrase heard, until clearPhrase() is called. */
    phrase?: string;
    clearPhrase: () => void;
}

/** Speech recognition only exists in Chromium browsers (Chrome, Edge, Electron), and there under a webkit prefix. */
export const getSpeechRecognition = (): SpeechRecognitionConstructor | undefined =>
    window.SpeechRecognition ?? window.webkitSpeechRecognition;

export const useSpeechControl = (): SpeechControl => {
    const {t, i18n} = useTranslation();
    const {speechControl} = useSettingsStore();
    const [phrase, setPhrase] = useState<string>();
    const speechRecogRef = useRef<SpeechRecognition>(null);
    const restartTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const targetLanguage = useMemo(() => langSwitch(i18n.language), [i18n.language]);

    const clearPhrase = (): void => {
        setPhrase(undefined);

        // Completely restart speech recognition after each command
        if (speechRecogRef.current !== null) {
            try {
                speechRecogRef.current.stop();
            } catch (error) {
                console.warn('Error stopping speech recognition for restart:', error);
            }
        }

        if (restartTimeoutRef.current !== null) {
            clearTimeout(restartTimeoutRef.current);
        }

        // Schedule a fresh restart
        restartTimeoutRef.current = setTimeout(() => {
            startFreshSpeechRecognition();
        }, 100);
    };

    const startFreshSpeechRecognition = (): void => {
        const SpeechRecognition = getSpeechRecognition();
        if (SpeechRecognition === undefined || !speechControl) {
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = targetLanguage;

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1]?.[0]?.transcript;
            if (transcript === undefined || transcript.trim() === '') {
                return;
            }
            setPhrase(transcript);
        };

        recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
        };

        recognition.onstart = null;
        recognition.onend = null;

        speechRecogRef.current = recognition;

        try {
            recognition.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
        }
    };

    // The effect restarts recognition when the setting or language changes, and calls the latest version of
    // startFreshSpeechRecognition without listing it (it changes every render).
    const startRecognition = useEffectEvent((): void => startFreshSpeechRecognition());

    useEffect(() => {
        if (!speechControl) {
            return;
        }

        startRecognition();

        return () => {
            if (restartTimeoutRef.current !== null) {
                clearTimeout(restartTimeoutRef.current);
            }
            if (speechRecogRef.current !== null) {
                try {
                    speechRecogRef.current.stop();
                } catch (error) {
                    console.warn('Error stopping speech recognition:', error);
                }
                speechRecogRef.current = null;
            }
        };
    }, [speechControl, targetLanguage]);

    return {
        speechControl,
        speechControlText: speechControl ? t('speechControl.on') : t('speechControl.off'),
        clearPhrase,
        ...definedProps({phrase}),
    };
};
