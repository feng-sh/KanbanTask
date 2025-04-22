'use server';

import { db } from '@/lib/db';
import { columns, tasks, teamMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
