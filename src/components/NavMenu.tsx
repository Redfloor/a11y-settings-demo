import {KeyboardEvent, useEffect, useRef} from 'react';
import {styled} from 'styled-components';

import {Button} from './Button';

export interface NavMenuItem {
    title: string;
    onClick?: () => void;
    isHidden?: boolean;
}

export interface NavMenuProps {
    items: NavMenuItem[];
    /** Which item is highlighted. Arrow keys and voice commands move it; the parent holds it. */
    focusedIndex: number;
    onFocusChange: (index: number) => void;
    label: string;
}

const StyledNavMenu = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    max-width: 20rem;
`;

/**
 * A vertical menu. Arrow keys move between items (only while focus is in the menu, so the rest of the page keeps its
 * keys), and Enter and Space are the buttons' own. When the highlighted item changes, focus follows it, so voice
 * navigation and keyboard navigation always agree.
 */
export const NavMenu = ({items, focusedIndex, onFocusChange, label}: NavMenuProps) => {
    const visibleItems = items.filter((item) => item.isHidden !== true);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const previousIndex = useRef(focusedIndex);

    useEffect(() => {
        // Only move focus when the highlighted item changes, never when the page first loads.
        if (previousIndex.current === focusedIndex) {
            return;
        }
        previousIndex.current = focusedIndex;
        buttonRefs.current[focusedIndex]?.focus();
    }, [focusedIndex]);

    const onKeyDown = (event: KeyboardEvent): void => {
        const count = visibleItems.length;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            onFocusChange((focusedIndex + 1) % count);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            onFocusChange((focusedIndex - 1 + count) % count);
        }
    };

    return (
        <StyledNavMenu role="group" aria-label={label} onKeyDown={onKeyDown}>
            {visibleItems.map((item, index) => (
                <Button
                    key={item.title}
                    label={item.title}
                    isPrimary={index === focusedIndex}
                    // One tab stop for the whole menu: Tab reaches the highlighted item, the arrow keys do the rest.
                    tabIndex={index === focusedIndex ? 0 : -1}
                    ref={(element) => {
                        buttonRefs.current[index] = element;
                    }}
                    onClick={() => {
                        onFocusChange(index);
                        item.onClick?.();
                    }}
                />
            ))}
        </StyledNavMenu>
    );
};
