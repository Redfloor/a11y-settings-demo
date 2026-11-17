import {ReactNode, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {keyframes, styled} from 'styled-components';

import {whenReducedMotion} from '../motion/reducedMotion';
import {useResolvedMotion} from '../motion/useMotion';
import {useMenuSpeechControl} from '../speech/useMenuSpeechControl';

import {NavMenu, NavMenuItem} from './NavMenu';

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

// The reduced-motion version: no movement, only a change in opacity, so it still shows something is happening.
const pulse = keyframes`
    50% { opacity: 0.3; }
`;

const StyledPreview = styled.section`
    background-color: var(--background-color);
    border: 2px solid var(--primary-color);
    border-radius: var(--spacing-2);
    padding: var(--spacing-3);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
`;

const StyledMovingSquare = styled.div`
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    background-color: var(--primary-color);
    animation: ${spin} 2s linear infinite;

    ${whenReducedMotion} {
        animation: ${pulse} 2s ease-in-out infinite;
    }
`;

const StyledRow = styled.div`
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
`;

/** Shows each setting doing its job: colours, text size and spacing, motion, and voice control of a menu. */
export const Preview = (): ReactNode => {
    const {t} = useTranslation();
    const motion = useResolvedMotion();
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [chosen, setChosen] = useState('');

    const options: NavMenuItem[] = ['one', 'two', 'three'].map((key) => {
        const title = t(`preview.option.${key}`);
        return {title, onClick: () => setChosen(title)};
    });

    const {speechControl} = useMenuSpeechControl({menuItems: options, focusedIndex, setFocusedIndex});

    return (
        <StyledPreview aria-labelledby="preview-title">
            <h2 id="preview-title">{t('preview.title')}</h2>
            <p>{t('preview.body')}</p>

            <div>
                <h2>{t('preview.motionTitle')}</h2>
                <StyledRow>
                    <StyledMovingSquare aria-hidden="true"/>
                    <p>{t(`preview.motion.${motion}`)}</p>
                </StyledRow>
            </div>

            <div>
                <h2 id="menu-title">{t('preview.menuTitle')}</h2>
                <p>{t('preview.menuHelp')}</p>
                <p>{speechControl ? t('speechControl.on') : t('speechControl.off')}</p>
                <NavMenu
                    label={t('preview.menuTitle')}
                    items={options}
                    focusedIndex={focusedIndex}
                    onFocusChange={setFocusedIndex}
                />
                <p role="status">{chosen !== '' ? t('preview.chosen', {option: chosen}) : ''}</p>
            </div>
        </StyledPreview>
    );
};
