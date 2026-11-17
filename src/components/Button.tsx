import {forwardRef} from 'react';
import {styled} from 'styled-components';

export interface ButtonProps {
    label: string;
    onClick?: () => void;
    isPrimary?: boolean;
    tabIndex?: number;
}

const StyledButton = styled.button<{ $isPrimary: boolean }>`
    font-size: var(--font-size-medium);
    padding: var(--spacing-1) var(--spacing-3);
    min-height: 2.5rem;
    border: 2px solid var(--primary-color);
    border-radius: var(--spacing-1);
    background-color: ${({$isPrimary}) => $isPrimary ? 'var(--primary-color)' : 'var(--background-color)'};
    color: ${({$isPrimary}) => $isPrimary ? 'var(--background-color)' : 'var(--text-color)'};
    cursor: pointer;
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({label, isPrimary = false, ...props}, ref) => (
    <StyledButton type="button" ref={ref} $isPrimary={isPrimary} {...props}>
        {label}
    </StyledButton>
));

Button.displayName = 'Button';
