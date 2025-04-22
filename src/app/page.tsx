"use client";

import { KanbanBoard } from "@/components/kanban/kanban-board";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * ホームページコンポーネント
 * カンバンボードをホームページに表示します
 */
export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-end items-center mb-8">
        <ThemeToggle />
      </header>

      <main className="container mx-auto max-w-6xl">
        <KanbanBoard />
        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>Kanban board built with shadcn/ui and Tailwind CSS</p>
        </div>
      </main>
    </div>
  );
}
