"use client"

import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Trash2, Volume2 } from "lucide-react"
import type { Flashcard } from "@/types"

interface FlashcardProps {
  card: Flashcard
  onDelete?: () => void
  onRate?: (id: number, level: 'easy' | 'hard') => void
  onNext?: () => void
}

export function FlashcardComponent({ card, onDelete, onRate, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setIsFlipped(false)
  }, [card.id])

  const speak = (text: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "zh-CN"
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  const handleFlip = () => {
    const nextFlipState = !isFlipped
    setIsFlipped(nextFlipState)
    if (nextFlipState) speak(card.character)
  }

  const handleRating = (e: React.MouseEvent, level: 'easy' | 'hard') => {
    e.stopPropagation()
    if (onRate) onRate(card.id, level)
    if (onNext) onNext()
  }

  return (
    <div className="relative group">
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 z-20 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        onClick={(e) => {
          e.stopPropagation()
          if (onDelete && confirm("¿Eliminar tarjeta?")) onDelete()
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="flip-card w-full h-80" onClick={handleFlip}>
        <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
          
          <Card className="flip-card-front bg-card border-2 border-border cursor-pointer hover:shadow-md transition-all duration-300">
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="text-8xl font-bold text-amber-600 mb-4">{card.character}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Revelar</div>
            </div>
          </Card>

          <Card className="flip-card-back bg-secondary border-2 border-border cursor-pointer overflow-hidden relative">
            <div className="h-full flex flex-col items-center justify-center p-6 text-secondary-foreground">
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-amber-600 hover:bg-amber-100/50 rounded-full transition-colors"
                onClick={(e) => { e.stopPropagation(); speak(card.character); }}
              >
                <Volume2 className="w-6 h-6" />
              </Button>

              <div className="text-6xl font-bold mb-1 text-amber-600">{card.character}</div>
              <div className="text-2xl mb-2 font-medium text-amber-700/80">{card.pinyin}</div>
              <div className="text-xl text-center mb-8 px-4 font-light">"{card.translation}"</div>

              <div className="flex gap-3 w-full mt-auto">
                <Button 
                  onClick={(e) => handleRating(e, 'hard')}
                  className="flex-1 h-12 bg-background/50 hover:bg-background/80 border-border text-foreground border shadow-sm transition-all active:scale-95 hover:-translate-y-0.5"
                  variant="outline"
                >
                  Repetir
                </Button>
                
                <Button 
                  onClick={(e) => handleRating(e, 'easy')}
                  className="flex-1 h-12 bg-background/50 hover:bg-background/80 border-border text-foreground border shadow-sm transition-all active:scale-95 hover:-translate-y-0.5"
                  variant="outline"
                >
                  Aprendido
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}