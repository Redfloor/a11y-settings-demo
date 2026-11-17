export function logUnrecognizedPhrase(phrase: string): void {
    // Extend here for TTS or UI feedback
    console.warn("Unrecognized speech command:", phrase);
}
