"use client"

import { KanbanBoard } from "@/components/kanban/kanban-board"
import { ThemeToggle } from "@/components/theme-toggle"

export default function KanbanPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <ThemeToggle />
      </header>

      <main>
        <KanbanBoard />
      </main>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>Kanban board built with shadcn/ui and Tailwind CSS</p>
      </footer>
    </div>
  )
}
