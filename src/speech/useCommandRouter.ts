import type {NavMenuItem} from "../components/NavMenu";

import {mapPhraseToCommand} from "./phraseToCommand";

type MenuNavigationContext = {
    menuItems: NavMenuItem[];
    focusedIndex: number;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
};

type CommandHandlers = {
    onNext?: () => void;
    onSelect?: () => void;
    onCustom?: (commandType: string) => void;
};

type MenuHandlers = { onNext: () => void; onSelect: () => void };

interface CommandRouter {
    executeCommand: (phrase: string, language: string, handlers: CommandHandlers, menuContext?: MenuNavigationContext) => boolean;
    createMenuHandler: (menuContext: MenuNavigationContext) => MenuHandlers;
}

export const useCommandRouter = (): CommandRouter => {
    const executeCommand = (
        phrase: string,
        language: string,
        handlers: CommandHandlers,
        menuContext?: MenuNavigationContext
    ) => {
        const command = mapPhraseToCommand(phrase, language);
        if (!command) return false;

        switch (command) {
            case "next":
                if (handlers.onNext) {
                    handlers.onNext();
                } else if (menuContext) {
                    const newIndex = (menuContext.focusedIndex + 1) % menuContext.menuItems.length;
                    menuContext.setFocusedIndex(newIndex);
                }
                return true;

            case "select":
                if (handlers.onSelect) {
                    handlers.onSelect();
                } else if (menuContext) {
                    const item = menuContext.menuItems[menuContext.focusedIndex];
                    item?.onClick?.();
                }
                return true;

            default:
                handlers.onCustom?.(command);
                return false;
        }
    };

    // Simplified menu navigation helper
    const createMenuHandler = (menuContext: MenuNavigationContext) => ({
        onNext: () => menuContext.setFocusedIndex(prev => (prev + 1) % menuContext.menuItems.length),
        onSelect: () => {
            const item = menuContext.menuItems[menuContext.focusedIndex];
            item?.onClick?.();
        }
    });

    return {
        executeCommand,
        createMenuHandler
    };
};
