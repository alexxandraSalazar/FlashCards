"use client"

import { useState } from "react"
import Papa from "papaparse"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Upload, FileText, Loader2 } from "lucide-react"
import { flashcardService } from "@/services/flashcards"

export function ImportDialog({ onImportSuccess }: { onImportSuccess: () => void }) {
    const [isUploading, setIsUploading] = useState(false)
    const [open, setOpen] = useState(false)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)

        Papa.parse(file, {
            header: true, 
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const formattedCards = results.data.map((row: any) => ({
                        character: row.character,
                        pinyin: row.pinyin,
                        translation: row.translation,
                        deck_name: row.deck_name || "Importados"
                    }))

                    await flashcardService.importCards(formattedCards)
                    onImportSuccess()
                    setOpen(false)
                } catch (error) {
                    console.error("Error al importar:", error)
                    alert("Hubo un error con el formato del archivo.")
                } finally {
                    setIsUploading(false)
                }
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Importar CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Importar Flashcards</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl space-y-4">
                    <FileText className="w-12 h-12 text-yellow-500 opacity-20" />
                    <div className="text-center">
                        <p className="text-sm font-medium">Sube tu archivo .csv</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Columnas requeridas: character, pinyin, translation, deck_name
                        </p>
                    </div>
                    <label className="cursor-pointer">
                        <div className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors flex items-center">
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                            Seleccionar Archivo
                        </div>
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                </div>
            </DialogContent>
        </Dialog>
    )
}