"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface AddFlashcardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddFlashcard: (deckName: string, flashcard: { character: string; pinyin: string; translation: string }) => void
  availableDecks: string[]
}

export function AddFlashcardDialog({ open, onOpenChange, onAddFlashcard, availableDecks }: AddFlashcardDialogProps) {
  const [character, setCharacter] = useState("")
  const [pinyin, setPinyin] = useState("")
  const [translation, setTranslation] = useState("")
  const [selectedDeck, setSelectedDeck] = useState("")
  const [newDeckName, setNewDeckName] = useState("")
  const [isCreatingNewDeck, setIsCreatingNewDeck] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!character || !pinyin || !translation) return

    const deckName = isCreatingNewDeck ? newDeckName : selectedDeck
    if (!deckName) return

    onAddFlashcard(deckName, { character, pinyin, translation })

    // Reset form
    setCharacter("")
    setPinyin("")
    setTranslation("")
    setSelectedDeck("")
    setNewDeckName("")
    setIsCreatingNewDeck(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Flashcard</DialogTitle>
          <DialogDescription>
            Crea una nueva tarjeta de estudio con el carácter chino, pinyin y traducción.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="character">Carácter Chino</Label>
            <Input
              id="character"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              placeholder="例: 学习"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinyin">Pinyin</Label>
            <Input
              id="pinyin"
              value={pinyin}
              onChange={(e) => setPinyin(e.target.value)}
              placeholder="例: xuéxí"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="translation">Traducción</Label>
            <Input
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="例: estudiar"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Mazo</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="existing-deck"
                  name="deck-option"
                  checked={!isCreatingNewDeck}
                  onChange={() => setIsCreatingNewDeck(false)}
                />
                <Label htmlFor="existing-deck">Usar mazo existente</Label>
              </div>

              {!isCreatingNewDeck && (
                <Select value={selectedDeck} onValueChange={setSelectedDeck}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un mazo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDecks.map((deck) => (
                      <SelectItem key={deck} value={deck}>
                        {deck}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="new-deck"
                  name="deck-option"
                  checked={isCreatingNewDeck}
                  onChange={() => setIsCreatingNewDeck(true)}
                />
                <Label htmlFor="new-deck">Crear nuevo mazo</Label>
              </div>

              {isCreatingNewDeck && (
                <Input
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="Nombre del nuevo mazo"
                  required={isCreatingNewDeck}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit"  className="bg-yellow-500 hover:bg-yellow-600 text-white">Agregar Flashcard</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
