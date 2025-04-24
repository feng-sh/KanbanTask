"use client"

import { useState, useMemo, useEffect } from "react";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { TaskDialog } from "./task-dialog";
import { Task, TeamMember, KanbanColumn as KanbanColumnType } from "./types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { getTeamMembers, getColumns, getTasks, createTask } from "@/lib/actions/kanban";

/**
 * カンバンボードコンポーネント
 *
 * タスクをステータス（Todo、In Progress、Done）ごとに分類して表示し、
 * 担当者の割り当て機能を提供します。
 */
export const KanbanBoard = () => {
  // データの状態管理
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // データの取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 并行でデータを取得
        const [membersResult, columnsResult, tasksResult] = await Promise.all([
          getTeamMembers(),
          getColumns(),
          getTasks()
        ]);

        // エラーハンドリング
        if (!membersResult.success) {
          throw new Error(membersResult.error || 'チームメンバーの取得に失敗しました');
        }
        if (!columnsResult.success) {
          throw new Error(columnsResult.error || 'カラムの取得に失敗しました');
        }
        if (!tasksResult.success) {
          throw new Error(tasksResult.error || 'タスクの取得に失敗しました');
        }

        // データを設定
        if (membersResult.data) setTeamMembers(membersResult.data);
        if (columnsResult.data) setColumns(columnsResult.data);
        if (tasksResult.data) setTasks(tasksResult.data);
        setErrorMessage(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setErrorMessage('データの取得に失敗しました。ページを再読み込みしてください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * ダイアログの状態管理
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * 編集中のタスクの状態管理
   */
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { assignee, ...rest } = task;
            return rest;
          } else {
            // 新しい担当者を設定
            const newAssignee = teamMembers.find((member) => member.id === assigneeId)
            // エラーハンドリング: 担当者が見つからない場合
            if (!newAssignee) {
              console.warn(`Team member with ID ${assigneeId} not found`);
              return task; // 変更せずに元のタスクを返す
            }
            return { ...task, assignee: newAssignee };
          }
        }
        return task;
      })
    );
  };

  /**
   * タスクをステータスでフィルタリング（メモ化）
   * 各カラム（Todo、In Progress、Done）に表示するタスクを取得
   * useMemoを使用して再レンダリング時のパフォーマンスを最適化
   */
  const filteredTasks = useMemo(() => {
    return columns.reduce<Record<string, Task[]>>((acc, column) => {
      acc[column.id] = tasks.filter(task => task.status === column.status);
      return acc;
    }, {});
  }, [tasks, columns]);

  /**
   * タスクの編集を開始する関数
   * @param task - 編集対象のタスク
   */
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  /**
   * 新規タスクの作成を開始する関数
   */
  const handleCreateTask = () => {
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  /**
   * タスクの保存処理を行う関数
   * @param values - フォームの値
   */
  const handleSaveTask = async (values: {
    id?: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    assigneeId?: string;
  }) => {
    if (values.id) {
      // 既存タスクの更新
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === values.id) {
            // 担当者の処理
            let assignee
            if (values.assigneeId && values.assigneeId !== "unassigned") {
              assignee = teamMembers.find((member) => member.id === values.assigneeId);
            }

            return {
              ...task,
              title: values.title,
              description: values.description,
              status: values.status,
              priority: values.priority,
              assignee,
            };
          }
          return task;
        })
      );
    } else {
      try {
        // 新規タスクの作成（サーバーアクションを使用）
        setIsLoading(true);

        const result = await createTask({
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          assigneeId: values.assigneeId !== "unassigned" ? values.assigneeId : undefined,
        });

        if (result.success && result.data) {
          // 作成されたタスクをステートに追加
          setTasks((prevTasks) => [...prevTasks, result.data]);
        } else {
          // エラーメッセージを表示
          setErrorMessage(`タスクの作成に失敗しました: ${result.error || '不明なエラー'}`);
          console.error('Failed to create task:', result.error);
        }
      } catch (error) {
        console.error('Error creating task:', error);
        setErrorMessage('タスクの作成中にエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>データを読み込み中です...</p>
        </div>
      </div>
    );
  }

  // エラーの表示
  if (errorMessage) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="text-center text-destructive">
          <p className="mb-4">{errorMessage}</p>
          <Button onClick={() => window.location.reload()}>再読み込み</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreateTask} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          新規タスク
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-[768px] gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            count={filteredTasks[column.id]?.length || 0}
          >
            {filteredTasks[column.id]?.map((task) => (
              <div key={task.id} onClick={() => handleEditTask(task)} className="cursor-pointer">
                <TaskCard
                  task={task}
                  teamMembers={teamMembers}
                  onAssigneeChange={(assigneeId: string | null) =>
                    updateTaskAssignee(task.id, assigneeId)
                  }
                />
              </div>
            ))}
          </KanbanColumn>
        ))}
        </div>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        teamMembers={teamMembers}
        onSave={handleSaveTask}
      />
    </div>
  );
};