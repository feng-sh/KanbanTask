import { KanbanBoard } from "@/components/kanban/kanban-board";
import { ThemeToggle } from "@/components/theme-toggle";
/**
 * カンバンページコンポーネント
 */
const KanbanPage = () => {
  return (
    <div className="min-h-screen p-8">
      <header className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <ThemeToggle />
      </header>
      <main className="container mx-auto max-w-6xl">
        <KanbanBoard />
      </main>
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>Kanban board built with shadcn/ui and Tailwind CSS</p>
      </div>
    </div>
  );
};

export default KanbanPage;
