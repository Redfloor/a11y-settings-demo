import {act, fireEvent, render, screen} from '@testing-library/react';

import {App} from './App';
import {defaultSettings, useSettingsStore} from './settings/useSettings';

const root = document.documentElement;

describe('the settings take effect', () => {
    beforeEach(() => {
        useSettingsStore.setState(defaultSettings);
        localStorage.clear();
    });

    it('applies the theme as a class on <html>', () => {
        render(<App/>);
        expect(root).toHaveClass('dark');

        fireEvent.change(screen.getByLabelText('Theme'), {target: {value: 'highContrast'}});
        expect(root).toHaveClass('highContrast');
        expect(root).not.toHaveClass('dark');
    });

    it('applies font size and spacing as classes on <html>', () => {
        render(<App/>);
        fireEvent.change(screen.getByLabelText('Font Size'), {target: {value: 'largeFonts'}});
        fireEvent.click(screen.getByLabelText('Accessible Spacing'));

        expect(root).toHaveClass('largeFonts', 'largeSpacing');
        expect(root).not.toHaveClass('normalFonts', 'normalSpacing');
    });

    it('sets <html data-motion> from the motion setting', () => {
        render(<App/>);
        fireEvent.change(screen.getByLabelText('Motion'), {target: {value: 'reduced'}});
        expect(root.dataset['motion']).toBe('reduced');
        expect(screen.getByText('Reduced motion: the square pulses instead of spinning.')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Motion'), {target: {value: 'full'}});
        expect(root.dataset['motion']).toBe('full');
    });

    it('switches the language of the whole page, and <html lang> with it', async () => {
        render(<App/>);
        fireEvent.change(screen.getByLabelText('Language'), {target: {value: 'af'}});

        expect(await screen.findByRole('heading', {name: 'Instellings'})).toBeInTheDocument();
        expect(screen.getByLabelText('Tema')).toBeInTheDocument();
        expect(root.lang).toBe('af');
    });

    it('labels every control, so each has an accessible name', () => {
        render(<App/>);
        for (const name of ['Language', 'Theme', 'Font Size', 'Motion', 'Accessible Spacing', 'Speech Control']) {
            expect(screen.getByLabelText(name)).toBeInTheDocument();
        }
    });

    it('saves every change, the language included, with no Save button', () => {
        render(<App/>);
        fireEvent.change(screen.getByLabelText('Theme'), {target: {value: 'light'}});
        fireEvent.change(screen.getByLabelText('Language'), {target: {value: 'af'}});

        expect(JSON.parse(localStorage.getItem('settingsState') ?? '{}')).toMatchObject({theme: 'light', language: 'af'});
        expect(screen.queryByRole('button', {name: /save|stoor/i})).not.toBeInTheDocument();
    });

    it("explains that speech control isn't available when the browser can't recognise speech", () => {
        render(<App/>);
        expect(screen.getByLabelText('Speech Control')).toBeDisabled();
        expect(screen.getByLabelText('Speech Control')).toHaveAccessibleDescription(/doesn't support speech recognition/);
    });
});

describe('the menu', () => {
    it('moves with the arrow keys, and focus follows', () => {
        render(<App/>);
        const menu = screen.getByRole('group', {name: 'Voice-controlled menu'});
        const first = screen.getByRole('button', {name: 'Option one'});
        act(() => first.focus());

        fireEvent.keyDown(menu, {key: 'ArrowDown'});
        expect(screen.getByRole('button', {name: 'Option two'})).toHaveFocus();

        fireEvent.keyDown(menu, {key: 'ArrowUp'});
        fireEvent.keyDown(menu, {key: 'ArrowUp'});
        expect(screen.getByRole('button', {name: 'Option three'})).toHaveFocus();
    });

    it("doesn't take focus when the page loads", () => {
        render(<App/>);
        expect(document.body).toHaveFocus();
    });

    it("leaves other controls' keys alone", () => {
        render(<App/>);
        const spacing = screen.getByLabelText('Accessible Spacing');
        fireEvent.keyDown(spacing, {key: 'ArrowDown'});
        expect(screen.getByRole('button', {name: 'Option one'})).not.toHaveFocus();
    });
});
