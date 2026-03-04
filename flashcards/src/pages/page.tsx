"use client"

import { useState } from "react"
import { Button } from "@/pages/components/ui/button"
import { Card } from "@/pages/components/ui/card"
import { Badge } from "@/pages/components/ui/badge"
import { Plus, RotateCcw, ChevronLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react"
import { FlashcardComponent } from "./components/flashcard"
import { AddFlashcardDialog } from "./components/add-flashcard-dialog"
import { flashcardService } from "@/services/flashcards"
import { ImportDialog } from "./components/import-dialog"
import { useFlashcards } from "@/hooks/useFlashcards"

export default function FlashcardsApp() {
  // Extraemos la lógica del hook
  const { decks, loading, addCard, removeCard } = useFlashcards()

  const [selectedDeck, setSelectedDeck] = useState<string | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const currentDeckCards = selectedDeck ? decks[selectedDeck] || [] : []

  const nextCard = () => {
    if (currentCardIndex < currentDeckCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  const resetDeck = () => {
    setCurrentCardIndex(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
        <p className="text-muted-foreground animate-pulse">Cargando flashcards...</p>
      </div>
    )
  }

  if (selectedDeck) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => setSelectedDeck(null)} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Volver
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">{selectedDeck}</h1>
              <p className="text-muted-foreground">
                {currentCardIndex + 1} de {currentDeckCards.length}
              </p>
            </div>
            <Button variant="outline" onClick={resetDeck} className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>
          </div>
          <div className="mb-8">
            {currentDeckCards.length > 0 ? (
              <FlashcardComponent
                card={currentDeckCards[currentCardIndex]}
                onDelete={() => removeCard(currentDeckCards[currentCardIndex].id)}
                onRate={async (id, level) => {
                  await flashcardService.updateDifficulty(id, level);
                  nextCard(); // Pasa automáticamente a la siguiente tarjeta al calificar
                }}
              />
            ) : (
              <p className="text-center py-10 text-muted-foreground">No hay tarjetas en este mazo.</p>
            )}
          </div>
          {currentDeckCards.length > 0 && (
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="flex gap-2">
                {currentDeckCards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentCardIndex ? "bg-amber-600" : "bg-muted"}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={nextCard}
                disabled={currentCardIndex === currentDeckCards.length - 1}
                className="flex items-center gap-2 bg-transparent"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-foreground">Flashcards HSK</h1>
          </div>
          <p className="text-lg text-muted-foreground">Aprende caracteres chinos de forma interactiva</p>
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={() => setShowAddDialog(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Agregar Individual
          </Button>

          <ImportDialog onImportSuccess={() => window.location.reload()} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(decks).map(([deckName, cards]) => (
            <Card
              key={deckName}
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => {
                setSelectedDeck(deckName)
                setCurrentCardIndex(0)
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-card-foreground">{deckName}</h2>
                <Badge variant="secondary" className="text-sm">
                  {cards.length} tarjetas
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground">Practica caracteres del nivel {deckName}</p>

                <div className="flex gap-2 flex-wrap">
                  {cards.slice(0, 5).map((card) => (
                    <span key={card.id} className="text-2xl font-bold text-amber-600">
                      {card.character}
                    </span>
                  ))}
                  {cards.length > 5 && <span className="text-muted-foreground">...</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <AddFlashcardDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddFlashcard={addCard}
          availableDecks={Object.keys(decks)}
        />
      </div>
    </div>
  )
}