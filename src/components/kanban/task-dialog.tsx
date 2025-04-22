"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Task, TeamMember } from "./types"

/**
 * タスクフォームのバリデーションスキーマ
 */
const taskFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, {
    message: "タイトルは3文字以上で入力してください",
  }),
  description: z.string().min(5, {
    message: "説明は5文字以上で入力してください",
  }),
  status: z.enum(["todo", "in-progress", "done"], {
    required_error: "ステータスを選択してください",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "優先度を選択してください",
  }),
  assigneeId: z.string().optional(),
})

/**
 * フォームの値の型定義
 */
type TaskFormValues = z.infer<typeof taskFormSchema>

/**
 * デフォルトの空のフォーム値
 */
const defaultValues: Partial<TaskFormValues> = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assigneeId: "unassigned",
}

/**
 * タスクダイアログのプロパティ
 */
interface TaskDialogProps {
  /** ダイアログの表示状態 */
  open: boolean
  /** ダイアログの表示状態を変更する関数 */
  onOpenChange: (open: boolean) => void
  /** 編集対象のタスク（新規作成時はundefined） */
  task?: Task
  /** チームメンバーのリスト */
  teamMembers: TeamMember[]
  /** タスク保存時のコールバック関数 */
  onSave: (values: TaskFormValues) => void
}

/**
 * タスク作成・編集ダイアログコンポーネント
 *
 * タスクの作成と編集を行うダイアログを提供します。
 * フォームフィールドのバリデーションにはZodを使用しています。
 */
export const TaskDialog = ({
  open,
  onOpenChange,
  task,
  teamMembers,
  onSave,
}: TaskDialogProps) => {
  // フォームの初期化
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? {
          ...task,
          assigneeId: task.assignee?.id,
        }
      : defaultValues,
  })

  // ダイアログが開かれたときにフォームをリセット
  React.useEffect(() => {
    if (open) {
      if (task) {
        form.reset({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority || "medium",
          assigneeId: task.assignee?.id || "unassigned",
        })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [form, open, task])

  // フォーム送信ハンドラ
  const onSubmit = (values: TaskFormValues) => {
    onSave(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "タスクを編集" : "新しいタスクを作成"}</DialogTitle>
          <DialogDescription>
            {task
              ? "既存のタスク情報を編集します。完了したら保存ボタンをクリックしてください。"
              : "新しいタスクの詳細を入力してください。"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input placeholder="タスクのタイトルを入力" {...field} />
                  </FormControl>
                  <FormDescription>
                    タスクの簡潔なタイトルを入力してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="タスクの詳細な説明を入力"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    タスクの詳細な説明を入力してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ステータス</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="in-progress">進行中</SelectItem>
                        <SelectItem value="done">完了</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>優先度</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="優先度を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>担当者</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="担当者を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unassigned">未割り当て</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    このタスクを担当するメンバーを選択してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {task ? "更新" : "作成"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
