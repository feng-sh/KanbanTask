"use client"

import React from "react"
import { cn } from "@/lib/utils"

// KanbanColumnPropsの型定義はこのファイル内でのみ使用されるため、
// types.tsには移動せず、ここで定義しています

/**
 * カンバンカラムのプロパティ定義
 */
interface KanbanColumnProps {
  /** カラムのタイトル（Todo、In Progress、Doneなど） */
  title: string
  /** カラム内のタスク数 */
  count: number
  /** カラム内に表示するタスクカードなどの子要素 */
  children: React.ReactNode
  /** 追加のCSSクラス */
  className?: string
}

/**
 * カンバンボードの各カラム（Todo、In Progress、Done）を表示するコンポーネント
 *
 * カラムのタイトルとタスク数をヘッダーに表示し、
 * 子要素として渡されたタスクカードをスクロール可能な領域に表示します。
 *
 * @param props - カンバンカラムのプロパティ
 */
export function KanbanColumn({
  title,
  count,
  children,
  className,
}: KanbanColumnProps) {
  return (
    // カラムのコンテナ
    <div
      className={cn(
        "flex flex-1 flex-col rounded-lg bg-secondary/30 shadow-sm",
        className
      )}
    >
      {/* カラムヘッダー: タイトルとタスク数を表示 */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-medium">
          {title} <span className="ml-1 text-muted-foreground">({count})</span>
        </h3>
      </div>
      {/* タスクカードを表示するスクロール可能なエリア */}
      <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {children}
      </div>
    </div>
  )
}
