'use client'

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function AlternarTema() {
  const [escuro, setEscuro] = useState(false)

  function alternar() {
    document.documentElement.classList.toggle('dark', !escuro)
    setEscuro(!escuro)
  }

  return (
    <button
      aria-label="Alternar tema"
      onClick={alternar}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
    >
      {escuro ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
} 