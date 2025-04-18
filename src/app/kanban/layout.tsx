import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "A Kanban board built with shadcn/ui and Tailwind CSS",
}

export default function KanbanLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container mx-auto max-w-7xl">
      {children}
    </div>
  )
}
