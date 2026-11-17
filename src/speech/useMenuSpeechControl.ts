import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import type {NavMenuItem} from '../components/NavMenu';
import {definedProps} from '../definedProps';

import {useCommandRouter} from './useCommandRouter';
import {SpeechControl, useSpeechControl} from './useSpeechControl';

type MenuSpeechControlOptions = {
    menuItems: NavMenuItem[];
    focusedIndex: number;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
    customHandlers?: {
        onNext?: () => void;
        onSelect?: () => void;
        onCustom?: (commandType: string) => void;
    };
};

export const useMenuSpeechControl = (options: MenuSpeechControlOptions): Pick<SpeechControl, 'speechControl' | 'phrase'> => {
    const {i18n} = useTranslation();
    const {phrase, speechControl, clearPhrase} = useSpeechControl();
    const {executeCommand} = useCommandRouter();

    useEffect(() => {
        if (!speechControl || phrase === undefined || phrase.trim() === '') return;

        const menuContext = {
            menuItems: options.menuItems,
            focusedIndex: options.focusedIndex,
            setFocusedIndex: options.setFocusedIndex
        };

        const handlers = options.customHandlers || {};
        executeCommand(phrase, i18n.language, handlers, menuContext);
        clearPhrase();
    }, [
        phrase,
        speechControl,
        options.menuItems,
        options.focusedIndex,
        options.setFocusedIndex,
        options.customHandlers,
        i18n.language,
        clearPhrase,
        executeCommand
    ]);

    return {
        speechControl,
        ...definedProps({phrase}),
    };
};
