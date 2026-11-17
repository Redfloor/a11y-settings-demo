# a11y-settings-demo

The accessibility settings page from the Dark Playground game engine, taken out of the
game as a standalone React app. It contains every setting on that page that actually changes something, and a preview
panel that shows each one working.

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # Vitest
npm run build   # type check + production build
```

React 19, TypeScript 6 (strict), Vite, Zustand, styled-components and i18next, the same as the game.

## The settings

| Setting | How it takes effect | Where |
|---|---|---|
| **Theme** (Light, Dark, High Contrast, Protanopia, Deuteranopia, Tritanopia, Achromatopsia) | A class on `<html>` that sets the colour variables (`--primary-color`, `--text-color`, …) | `src/theme` |
| **Font size** (Normal, Large) | A class on `<html>` that sets `--font-size-*` and `--line-height-*`. The font is OpenDyslexic | `src/theme/fontSizes` |
| **Accessible spacing** | A class on `<html>` that sets `--spacing-1` to `--spacing-4` | `src/theme/spacing` |
| **Motion** (Follow system setting, Reduced, Full) | `<html data-motion="reduced" \| "full">`, resolved against the OS `prefers-reduced-motion` and updated live when the OS setting changes | `src/motion` |
| **Language** (English, Afrikaans) | i18next; also sets `<html lang>` so screen readers pronounce the page correctly | `src/i18n` |
| **Speech control** | Listens with the Web Speech API: "next" moves through a menu and "select" chooses, in English or Afrikaans | `src/speech` |

Every setting applies as soon as it changes. **Save** keeps them in `localStorage` for next time.

Components never read the settings themselves. They use the CSS variables, and the few that move add a reduced-motion
version with `whenReducedMotion`:

```ts
const StyledMovingSquare = styled.div`
    animation: ${spin} 2s linear infinite;

    ${whenReducedMotion} {
        animation: ${pulse} 2s ease-in-out infinite;  /* no movement, only opacity */
    }
`;
```

So adding a theme is a CSS file and one line in `styleClasses.ts`, and a new component follows every setting without
any extra code.

## i18n

- One JSON file per language in `src/i18n/locales`, all in i18next's default `translation` namespace.
- Short labels use their English text as the key (`"Theme"`), and longer or grouped strings use dotted names
  (`"Motion.label"`, `"preview.body"`).
- `src/i18n/resources.ts` lists the languages. Each one is shown in its own language ("Afrikaans", whatever the page
  language is), so a player who can't read the current language can still find theirs.
- Speech recognition gets the matching language tag from `src/speech/langSwitch.ts`, and the voice commands in each
  language are in `src/speech/phraseToCommand.ts`. Commands match whole words, so "good" doesn't count as "go".

To add a language, add its JSON file, add it to `resources.ts`, `langSwitch.ts` and `phraseToCommand.ts`.

The Afrikaans text is machine-generated and hasn't been checked by a fluent speaker.

## Differences from the game

This is the game's code, with these changes:

- **Only working settings.** The game's page also has Keyboard Control, Mouse Control, VOX Control, Narrative Mode,
  Text-to-Speech and Subtitles/Captions. Nothing in the game reads them yet, so they're left out here.
- **Every control has a linked label** (`htmlFor`/`id`), so each has an accessible name.
- **The menu's keys stay in the menu.** The game's NavMenu listens for keys on the whole window, so Enter and Space on
  any other control also trigger the menu. Here the arrow keys only work while focus is in the menu, Enter and Space
  are the buttons' own, and the menu is a single Tab stop.
- **Speech recognition uses `en-GB`** (the game sends `en-UK`, which isn't a valid language tag), and the page says when
  the browser has no speech recognition (anything but Chromium-based browsers) instead of the setting silently doing
  nothing.
- **Save announces itself** to screen readers, and `<html lang>` follows the language.
- **Controls use the main background colour.** In the High Contrast theme, the secondary background is black while
  the text is also black.
- **The font comes from `@fontsource/opendyslexic`** (SIL Open Font License) instead of bundled files.

## Known gaps (same as the game)

- The language isn't saved: it's back to English after a reload.
- Settings are only kept when Save is pressed.
- The Protanopia and Deuteranopia themes are identical, and several themes set `--text-color` twice.

## Layout

```
src/
  i18n/        i18next setup, languages, locales/*.json
  settings/    the settings store (Zustand): values, save/load, migration of old saves
  theme/       useTheme, the theme/font/spacing CSS, base.css
  motion/      the motion preference, useMotion, whenReducedMotion
  speech/      speech recognition, voice commands, menu voice control
  components/  SettingsPage, Preview, NavMenu, Button
```
