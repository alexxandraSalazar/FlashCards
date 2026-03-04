import { supabase } from "@/lib/supabase";
import type { Flashcard } from "@/types";

export const flashcardService = {
    async getAll(): Promise<Flashcard[]> {
        const { data, error } = await supabase
            .from('flashcards')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async create(card: Omit<Flashcard, 'id'>) {
        const { error } = await supabase
            .from('flashcards')
            .insert([card]);

        if (error) throw error;
    },

    async delete(id: number) {
        const { error } = await supabase
            .from('flashcards')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async updateDifficulty(id: number, level: 'easy' | 'hard') {
        const daysToAdd = level === 'easy' ? 3 : 0;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + daysToAdd);

        const { error } = await supabase
            .from('flashcards')
            .update({
                difficulty: level,
                next_review: nextDate.toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    },

    async importCards(cards: Omit<Flashcard, 'id'>[]) {
        const { data, error } = await supabase
            .from('flashcards')
            .insert(cards);

        if (error) throw error;
        return data;
    },

    
};