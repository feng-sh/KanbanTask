"use client"

import React from "react"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"

// Sample task data
export type Task = {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority?: "low" | "medium" | "high"
}

const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Research competitors",
    description: "Analyze top 5 competitors in the market",
    status: "todo",
    priority: "high",
  },
  {
    id: "task-2",
    title: "Design homepage",
    description: "Create wireframes for the new homepage",
    status: "todo",
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "task-4",
    title: "Implement authentication",
    description: "Add user login and registration functionality",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "task-5",
    title: "Write documentation",
    description: "Create user guide for the admin panel",
    status: "done",
    priority: "low",
  },
  {
    id: "task-6",
    title: "Fix navigation bug",
    description: "Resolve issue with dropdown menu on mobile",
    status: "done",
    priority: "high",
  },
]

export function KanbanBoard() {
  // Filter tasks by status
  const todoTasks = sampleTasks.filter((task) => task.status === "todo")
  const inProgressTasks = sampleTasks.filter((task) => task.status === "in-progress")
  const doneTasks = sampleTasks.filter((task) => task.status === "done")

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-[768px] gap-4 p-4">
        <KanbanColumn title="Todo" count={todoTasks.length}>
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </KanbanColumn>
        
        <KanbanColumn title="In Progress" count={inProgressTasks.length}>
          {inProgressTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </KanbanColumn>
        
        <KanbanColumn title="Done" count={doneTasks.length}>
          {doneTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </KanbanColumn>
      </div>
    </div>
  )
}
