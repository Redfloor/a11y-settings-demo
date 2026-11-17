import {logUnrecognizedPhrase} from "./logUnrecognizedPhrase";

type CommandType = "next" | "select";
type PhraseMap = Record<CommandType, string[]>;

const phraseMappings: Partial<Record<string, PhraseMap>> & { en: PhraseMap } = {
    en: {
        next: ["next", "go next", "down", "move down", "forward", "next option"],
        select: ["select", "choose", "enter", "pick", "confirm", "this one", "that one", "start", "get started", "go", "activate"],
    },
    af: {
        next: ["volgende", "voorintoe", "nog", "neer", "af", "afwaarts", "boontoe"],
        select: ["hierdie", "hier", "kies", "kies hierdie", "kies daardie", "bevestig", "selekteer"],
    },
};

// Lower-case words with punctuation stripped. Letters from any language count, so Afrikaans words stay whole.
const toWords = (text: string): string[] => text.toLowerCase().split(/[^\p{L}\p{N}']+/u).filter((word) => word.length > 0);

// True when the phrase's words appear together and in order, so "go" matches "let's go" but not "good".
const containsPhrase = (words: string[], phrase: string): boolean => {
    const target = toWords(phrase);
    return words.some((_word, start) => target.every((word, offset) => words[start + offset] === word));
};

export function mapPhraseToCommand(phrase: string, lang: string): CommandType | undefined {
    const mappings = phraseMappings[lang] ?? phraseMappings.en;
    const words = toWords(phrase);

    for (const [command, phrases] of Object.entries(mappings)) {
        if (phrases.some((p) => containsPhrase(words, p))) {
            return command as CommandType;
        }
    }

    logUnrecognizedPhrase(phrase);
    return undefined;
}
