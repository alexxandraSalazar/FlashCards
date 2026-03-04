export interface Flashcard {
    id: number;
    character: string;
    pinyin: string;
    translation: string;
    deck_name: string;
    created_at?: string;
}

export type Decks = Record<string, Flashcard[]>;