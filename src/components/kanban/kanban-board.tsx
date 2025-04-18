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
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
}

// Sample team members
const teamMembers = [
  {
    id: "user-1",
    name: "Alex Johnson",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },
  {
    id: "user-2",
    name: "Sam Wilson",
    avatar: "https://ui.shadcn.com/avatars/02.png",
  },
  {
    id: "user-3",
    name: "Taylor Kim",
    avatar: "https://ui.shadcn.com/avatars/03.png",
  },
  {
    id: "user-4",
    name: "Jordan Lee",
    avatar: "https://ui.shadcn.com/avatars/04.png",
  },
  {
    id: "user-5",
    name: "Casey Morgan",
    avatar: "https://ui.shadcn.com/avatars/05.png",
  },
]

const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Research competitors",
    description: "Analyze top 5 competitors in the market",
    status: "todo",
    priority: "high",
    assignee: teamMembers[0],
  },
  {
    id: "task-2",
    title: "Design homepage",
    description: "Create wireframes for the new homepage",
    status: "todo",
    priority: "medium",
    assignee: teamMembers[1],
  },
  {
    id: "task-3",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing",
    status: "in-progress",
    priority: "high",
    assignee: teamMembers[2],
  },
  {
    id: "task-4",
    title: "Implement authentication",
    description: "Add user login and registration functionality",
    status: "in-progress",
    priority: "medium",
    assignee: teamMembers[3],
  },
  {
    id: "task-5",
    title: "Write documentation",
    description: "Create user guide for the admin panel",
    status: "done",
    priority: "low",
    assignee: teamMembers[4],
  },
  {
    id: "task-6",
    title: "Fix navigation bug",
    description: "Resolve issue with dropdown menu on mobile",
    status: "done",
    priority: "high",
    assignee: teamMembers[0],
  },
]

export function KanbanBoard() {
  // State for tasks
  const [tasks, setTasks] = React.useState<Task[]>(sampleTasks)

  // Function to update task assignee
  const updateTaskAssignee = (taskId: string, assigneeId: string | null) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (assigneeId === null) {
            // Remove assignee
            const { assignee, ...rest } = task
            return rest
          } else {
            // Update assignee
            const newAssignee = teamMembers.find((member) => member.id === assigneeId)
            return { ...task, assignee: newAssignee }
          }
        }
        return task
      })
    )
  }

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const doneTasks = tasks.filter((task) => task.status === "done")

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-[768px] gap-4 p-4">
        <KanbanColumn title="Todo" count={todoTasks.length}>
          {todoTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onAssigneeChange={(assigneeId) => updateTaskAssignee(task.id, assigneeId)}
            />
          ))}
        </KanbanColumn>

        <KanbanColumn title="In Progress" count={inProgressTasks.length}>
          {inProgressTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onAssigneeChange={(assigneeId) => updateTaskAssignee(task.id, assigneeId)}
            />
          ))}
        </KanbanColumn>

        <KanbanColumn title="Done" count={doneTasks.length}>
          {doneTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onAssigneeChange={(assigneeId) => updateTaskAssignee(task.id, assigneeId)}
            />
          ))}
        </KanbanColumn>
      </div>
    </div>
  )
}
