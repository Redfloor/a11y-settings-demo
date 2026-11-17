import {useEffect} from 'react';

import {FontSize, Spacing, Theme, useSettingsStore} from '../settings/useSettings';

import {fontClasses, spacingClasses, themeClasses} from './styleClasses';
// Every theme, font size and spacing is plain CSS: a class on <html> that sets the CSS variables components use.
import './colorSchemes/light.css';
import './colorSchemes/achromatopsia.css';
import './colorSchemes/deuteranopia.css';
import './colorSchemes/highContrast.css';
import './colorSchemes/protanopia.css';
import './colorSchemes/tritanopia.css';
import './colorSchemes/dark.css';
import './fontSizes/normalFonts.css';
import './fontSizes/largeFonts.css';
import './spacing/normalSpacing.css';
import './spacing/largeSpacing.css';

interface Styles {
    theme: Theme;
    fontSize: FontSize;
    spacing: Spacing;
}

const replaceClasses = (root: HTMLElement, all: Record<string, string[]>, current: string[]): void => {
    Object.values(all).flat().forEach((cls) => root.classList.remove(cls));
    current.forEach((cls) => root.classList.add(cls));
};

/** Applies the theme, font size and spacing settings as classes on <html>. Call once, in App. */
export const useTheme = (): Styles => {
    const {theme, fontSize, spacing} = useSettingsStore();

    useEffect(() => {
        const root = document.documentElement;
        replaceClasses(root, themeClasses, themeClasses[theme]);
        replaceClasses(root, fontClasses, fontClasses[fontSize]);
        replaceClasses(root, spacingClasses, spacingClasses[spacing]);
    }, [theme, fontSize, spacing]);

    return {theme, fontSize, spacing};
};
