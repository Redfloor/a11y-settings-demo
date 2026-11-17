import {logUnrecognizedPhrase} from './logUnrecognizedPhrase';
import {mapPhraseToCommand} from './phraseToCommand';

vi.mock('./logUnrecognizedPhrase', () => ({logUnrecognizedPhrase: vi.fn()}));

describe('mapPhraseToCommand', () => {
    beforeEach(() => {
        vi.mocked(logUnrecognizedPhrase).mockClear();
    });

    describe('English', () => {
        it.each(['next', 'go next', 'down', 'move down', 'forward', 'next option'])('maps "%s" to next', (phrase) => {
            expect(mapPhraseToCommand(phrase, 'en')).toBe('next');
        });

        it.each(['select', 'choose', 'enter', 'pick', 'confirm', 'this one', 'that one', 'start', 'get started', 'go', 'activate'])(
            'maps "%s" to select',
            (phrase) => {
                expect(mapPhraseToCommand(phrase, 'en')).toBe('select');
            },
        );

        it('ignores case and surrounding whitespace', () => {
            expect(mapPhraseToCommand('  NEXT Option ', 'en')).toBe('next');
        });

        it('checks next before select, so "go next" is next rather than "go"', () => {
            expect(mapPhraseToCommand('go next', 'en')).toBe('next');
        });
    });

    describe('Afrikaans', () => {
        it.each(['volgende', 'voorintoe', 'nog', 'neer', 'af', 'afwaarts', 'boontoe'])('maps "%s" to next', (phrase) => {
            expect(mapPhraseToCommand(phrase, 'af')).toBe('next');
        });

        it.each(['hierdie', 'hier', 'kies', 'kies hierdie', 'kies daardie', 'bevestig', 'selekteer'])(
            'maps "%s" to select',
            (phrase) => {
                expect(mapPhraseToCommand(phrase, 'af')).toBe('select');
            },
        );

        it('does not understand English phrases', () => {
            expect(mapPhraseToCommand('select', 'af')).toBeUndefined();
        });
    });

    it('falls back to English for an unsupported language', () => {
        expect(mapPhraseToCommand('next', 'fr')).toBe('next');
    });

    it('returns undefined and logs the phrase when nothing matches', () => {
        expect(mapPhraseToCommand('banana', 'en')).toBeUndefined();
        expect(logUnrecognizedPhrase).toHaveBeenCalledWith('banana');
    });

    it('does not log a phrase it recognised', () => {
        mapPhraseToCommand('next', 'en');
        expect(logUnrecognizedPhrase).not.toHaveBeenCalled();
    });

    describe('whole-word matching', () => {
        it.each([
            ['good morning', 'en'],
            ['center', 'en'],
            ['forwards and backwards', 'en'],
            ['tafel', 'af'],
            ['hiernamaals', 'af'],
        ])('does not match part of a word in "%s"', (phrase, lang) => {
            expect(mapPhraseToCommand(phrase, lang)).toBeUndefined();
        });

        it('finds a command inside a longer sentence', () => {
            expect(mapPhraseToCommand('okay, go to the next one please', 'en')).toBe('next');
            expect(mapPhraseToCommand('I choose this', 'en')).toBe('select');
        });

        it('matches a multi-word phrase only with its words together and in order', () => {
            expect(mapPhraseToCommand('this one', 'en')).toBe('select');
            expect(mapPhraseToCommand('one of this', 'en')).toBeUndefined();
        });

        it('ignores punctuation around words', () => {
            expect(mapPhraseToCommand('Next!', 'en')).toBe('next');
            expect(mapPhraseToCommand('"kies", asseblief.', 'af')).toBe('select');
        });
    });
});
