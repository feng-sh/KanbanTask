"use client"

import React from "react"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"

/**
 * タスクのデータ構造を定義
 * タスクの基本情報と担当者情報を含む
 */
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

/**
 * サンプルチームメンバーデータ
 * タスクに割り当て可能なメンバーのリスト
 * 各メンバーはID、名前、アバター画像のURLを持つ
 */
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

/**
 * カンバンボードコンポーネント
 *
 * タスクをステータス（Todo、In Progress、Done）ごとに分類して表示し、
 * 担当者の割り当て機能を提供します。
 */
export function KanbanBoard() {
  /**
   * タスクの状態管理
   * 初期値としてサンプルタスクを設定
   */
  const [tasks, setTasks] = React.useState<Task[]>(sampleTasks)

  /**
   * タスクの担当者を更新する関数
   *
   * @param taskId - 更新対象のタスクID
   * @param assigneeId - 新しい担当者のID（nullの場合は担当者を削除）
   */
  const updateTaskAssignee = (taskId: string, assigneeId: string | null) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (assigneeId === null) {
            // 担当者を削除（割り当て解除）
            const { assignee, ...rest } = task
            return rest
          } else {
            // 新しい担当者を設定
            const newAssignee = teamMembers.find((member) => member.id === assigneeId)
            return { ...task, assignee: newAssignee }
          }
        }
        return task
      })
    )
  }

  /**
   * タスクをステータスでフィルタリング
   * 各カラム（Todo、In Progress、Done）に表示するタスクを取得
   */
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
              onAssigneeChange={(assigneeId: string | null) => updateTaskAssignee(task.id, assigneeId)}
            />
          ))}
        </KanbanColumn>

        <KanbanColumn title="In Progress" count={inProgressTasks.length}>
          {inProgressTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onAssigneeChange={(assigneeId: string | null) => updateTaskAssignee(task.id, assigneeId)}
            />
          ))}
        </KanbanColumn>

        <KanbanColumn title="Done" count={doneTasks.length}>
          {doneTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onAssigneeChange={(assigneeId: string | null) => updateTaskAssignee(task.id, assigneeId)}
            />
          ))}
        </KanbanColumn>
      </div>
    </div>
  )
}
