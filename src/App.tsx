import {ReactNode} from 'react';
import {styled} from 'styled-components';

import {Preview} from './components/Preview';
import {SettingsPage} from './components/SettingsPage';
import {useMotion} from './motion/useMotion';
import {useTheme} from './theme/useTheme';

const StyledLayout = styled.main`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
    gap: var(--spacing-4);
    align-items: start;
    max-width: 60rem;
    margin: 0 auto;
    padding: var(--spacing-4) var(--spacing-3);
`;

export const App = (): ReactNode => {
    // Each applies its settings to <html> (theme/font/spacing classes, data-motion), so plain CSS can follow them.
    useTheme();
    useMotion();

    return (
        <StyledLayout>
            <SettingsPage/>
            <Preview/>
        </StyledLayout>
    );
};
