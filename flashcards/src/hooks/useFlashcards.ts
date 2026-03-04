import { useState, useEffect, useCallback } from "react";
import { flashcardService } from "@/services/flashcards";
import type { Decks, Flashcard } from "@/types";

export function useFlashcards() {
    const [decks, setDecks] = useState<Decks>({});
    const [loading, setLoading] = useState(true);

    const loadCards = useCallback(async () => {
        try {
            setLoading(true);
            const data = await flashcardService.getAll();

            const grouped = data.reduce((acc: Decks, card: Flashcard) => {
                const name = card.deck_name;
                if (!acc[name]) acc[name] = [];
                acc[name].push(card);
                return acc;
            }, {});

            setDecks(grouped);
        } catch (e) {
            console.error("Error cargando mazos:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadCards(); }, [loadCards]);

    const addCard = async (deckName: string, cardData: Omit<Flashcard, 'id' | 'deck_name'>) => {
        await flashcardService.create({ ...cardData, deck_name: deckName });
        await loadCards();
    };

    const removeCard = async (id: number) => {
        await flashcardService.delete(id);
        await loadCards();
    };

    

    return { decks, loading, addCard, removeCard };
}