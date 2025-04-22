"use client"

import React from "react"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"
import { Task, TeamMember, KanbanColumn as KanbanColumnType } from "./types"

/**
 * サンプルチームメンバーデータ
 * タスクに割り当て可能なメンバーのリスト
 * 各メンバーはID、名前、アバター画像のURLを持つ
 */
const teamMembers: TeamMember[] = [
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

/**
 * サンプルタスクデータ
 * カンバンボードに表示する初期タスク
 */
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
 * カンバン列の定義
 * 各列のID、タイトル、対応するタスクのステータスを定義
 */
const columns: KanbanColumnType[] = [
  { id: "todo", title: "Todo", status: "todo" },
  { id: "in-progress", title: "In Progress", status: "in-progress" },
  { id: "done", title: "Done", status: "done" },
];

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
            // エラーハンドリング: 担当者が見つからない場合
            if (!newAssignee) {
              console.warn(`Team member with ID ${assigneeId} not found`)
              return task // 変更せずに元のタスクを返す
            }
            return { ...task, assignee: newAssignee }
          }
        }
        return task
      })
    )
  }

  /**
   * タスクをステータスでフィルタリング（メモ化）
   * 各カラム（Todo、In Progress、Done）に表示するタスクを取得
   * useMemoを使用して再レンダリング時のパフォーマンスを最適化
   */
  const filteredTasks = React.useMemo(() => {
    return columns.reduce<Record<string, Task[]>>((acc, column) => {
      acc[column.id] = tasks.filter(task => task.status === column.status);
      return acc;
    }, {});
  }, [tasks])

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Kanban Board</h2>
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-[768px] gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            count={filteredTasks[column.id]?.length || 0}
          >
            {filteredTasks[column.id]?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                teamMembers={teamMembers}
                onAssigneeChange={(assigneeId: string | null) =>
                  updateTaskAssignee(task.id, assigneeId)
                }
              />
            ))}
          </KanbanColumn>
        ))}
        </div>
      </div>
    </div>
  )
}
