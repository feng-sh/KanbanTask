"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Task, TeamMember } from "./types"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, UserCircle2 } from "lucide-react"

/**
 * タスクカードのプロパティ定義
 */
interface TaskCardProps {
  /** 表示するタスク情報 */
  task: Task
  /** 追加のCSSクラス */
  className?: string
  /** 割り当て可能なチームメンバーのリスト */
  teamMembers: TeamMember[]
  /** 担当者変更時のコールバック関数 */
  onAssigneeChange: (assigneeId: string | null) => void
}

/**
 * タスクカードコンポーネント
 *
 * タスクの詳細を表示し、担当者の割り当て・変更機能を提供します。
 *
 * @param task - 表示するタスク情報
 * @param className - 追加のCSSクラス
 * @param teamMembers - 割り当て可能なチームメンバーのリスト
 * @param onAssigneeChange - 担当者変更時のコールバック関数
 */
export const TaskCard = ({ task, className, teamMembers, onAssigneeChange }: TaskCardProps) => {
  // ポップオーバーの開閉状態を管理
  const [open, setOpen] = React.useState(false)

  /**
   * 優先度に応じたバッジの色を定義
   * 各優先度（低・中・高）に対して適切な色を設定
   * ライトモードとダークモードの両方に対応
   */
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }

  /**
   * 名前からイニシャルを生成する関数
   * 例: "John Doe" -> "JD"
   *
   * 処理内容:
   * 1. 名前を空白で分割して配列にする
   * 2. 各単語の最初の文字を取得
   * 3. 取得した文字を結合
   * 4. 大文字に変換
   *
   * @param name - イニシャルを生成する対象の名前
   * @returns 生成されたイニシャル（大文字）
   */
  const getInitials = (name: string): string => {
    return name
      .split(" ")      // 名前を空白で分割
      .map((n) => n[0]) // 各単語の最初の文字を取得
      .join("")        // 文字を結合
      .toUpperCase()    // 大文字に変換
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{task.title}</h4>
          {task.priority && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                priorityColors[task.priority]
              )}
            >
              {task.priority}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            ID: {task.id}
          </div>

          {/* 担当者割り当てのためのポップオーバーコンポーネント */}
          <Popover open={open} onOpenChange={setOpen}>
            {/* ポップオーバーを開くためのトリガーボタン */}
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed justify-start"
              >
                {/* 担当者が割り当てられている場合はアバターと名前を表示 */}
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{task.assignee.name}</span>
                  </div>
                ) : (
                  // 担当者が割り当てられていない場合は「Assign」を表示
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4" />
                    <span className="text-xs">Assign</span>
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            {/* チームメンバー選択のポップオーバーコンテンツ */}
            <PopoverContent className="w-[200px] p-0" align="end">
              <div className="max-h-[300px] overflow-auto">
                {/* チームメンバーのリストをマップして表示 */}
                {teamMembers.map((member) => (
                  <div
                    role="menuitem"
                    tabIndex={0}
                    key={member.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-secondary",
                      // 現在の担当者には背景色を適用
                      task.assignee?.id === member.id && "bg-secondary"
                    )}
                    onClick={() => {
                      // クリックされたメンバーを担当者に設定
                      onAssigneeChange(member.id)
                      setOpen(false) // ポップオーバーを閉じる
                    }}
                    onKeyDown={(e) => {
                      // キーボードアクセシビリティのサポート
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onAssigneeChange(member.id)
                        setOpen(false)
                      }
                    }}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                    {/* 現在の担当者にはチェックマークを表示 */}
                    {task.assignee?.id === member.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                ))}

                {/* 担当者が設定されている場合のみ「Unassign」オプションを表示 */}
                {task.assignee && (
                  <div
                    role="menuitem"
                    tabIndex={0}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-secondary border-t"
                    onClick={() => {
                      // 担当者の割り当てを解除
                      onAssigneeChange(null)
                      setOpen(false) // ポップオーバーを閉じる
                    }}
                    onKeyDown={(e) => {
                      // キーボードアクセシビリティのサポート
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onAssigneeChange(null)
                        setOpen(false)
                      }
                    }}
                  >
                    <UserCircle2 className="h-4 w-4" />
                    <span>Unassign</span>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
