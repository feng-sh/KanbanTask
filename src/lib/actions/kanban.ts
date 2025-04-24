'use server';

import { db } from '@/lib/db';
import { columns, tasks, teamMembers } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * チームメンバー一覧を取得する
 * @returns チームメンバーの配列
 */
export const getTeamMembers = async () => {
  try {
    const members = await db.select().from(teamMembers);
    return {
      success: true,
      data: members.map(member => ({
        id: member.userId,
        name: member.name,
        avatar: member.avatar || undefined,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return {
      success: false,
      error: 'チームメンバーの取得に失敗しました',
    };
  }
};

/**
 * カラム一覧を取得する
 * @returns カラムの配列
 */
export const getColumns = async () => {
  try {
    const columnList = await db.select().from(columns);
    return {
      success: true,
      data: columnList.map(column => ({
        id: column.status,
        title: column.title,
        status: column.status,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch columns:', error);
    return {
      success: false,
      error: 'カラムの取得に失敗しました',
    };
  }
};

/**
 * タスク一覧を取得する
 * @returns タスクの配列
 */
export const getTasks = async () => {
  try {
    // タスクとその担当者を結合して取得
    const taskList = await db.query.tasks.findMany({
      with: {
        assignee: true,
      },
    });

    return {
      success: true,
      data: taskList.map(task => ({
        id: String(task.id), // 数値IDを文字列に変換
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        assignee: task.assignee ? {
          id: task.assignee.userId,
          name: task.assignee.name,
          avatar: task.assignee.avatar || undefined,
        } : undefined,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return {
      success: false,
      error: 'タスクの取得に失敗しました',
    };
  }
};

/**
 * 新しいタスクを作成する
 * @param taskData - 作成するタスクのデータ
 * @returns 作成されたタスクの情報
 */
export const createTask = async (taskData: {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assigneeId?: string;
}) => {
  // 明示的なデバッグポイント
  debugger;

  // 入力データをデバッグログに出力
  console.log('CreateTask Input:', JSON.stringify(taskData, null, 2));

  try {
    // バリデーション
    if (!taskData.title) {
      return {
        success: false,
        error: 'タイトルは必須です',
      };
    }

    // 担当者の処理
    let assigneeId: number | null = null;
    if (taskData.assigneeId && taskData.assigneeId !== 'unassigned') {
      // 担当者IDが指定されている場合、データベースに存在するか確認
      const member = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.userId, taskData.assigneeId),
      });

      if (member) {
        assigneeId = member.id;
      } else {
        console.warn(`Team member with ID ${taskData.assigneeId} not found`);
      }
    }

    // タスクをデータベースに挿入
    // 明示的なデバッグポイント
    debugger;

    const insertValues = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      assigneeId: assigneeId, // nullを許容するようになったので、常に設定可能
    };

    console.log('Insert Values:', JSON.stringify(insertValues, null, 2));

    const insertedTask = await db.insert(tasks).values(insertValues).returning();

    if (!insertedTask || insertedTask.length === 0) {
      throw new Error('タスクの作成に失敗しました');
    }

    const newTask = insertedTask[0];

    // 担当者情報を取得（存在する場合）
    let assignee = undefined;
    if (newTask.assigneeId) {
      const member = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.id, newTask.assigneeId),
      });

      if (member) {
        assignee = {
          id: member.userId,
          name: member.name,
          avatar: member.avatar || undefined,
        };
      }
    }

    // 作成されたタスクを返す
    return {
      success: true,
      data: {
        id: String(newTask.id),
        title: newTask.title,
        description: newTask.description || '',
        status: newTask.status,
        priority: newTask.priority || 'medium',
        assignee: assignee || undefined,
      },
    };
  } catch (error) {
    console.error('Failed to create task:', error);
    return {
      success: false,
      error: `タスクの作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};
