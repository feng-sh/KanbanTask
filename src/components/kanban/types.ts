/**
 * チームメンバーの型定義
 */
export type TeamMember = {
  /** メンバーの一意のID */
  id: string;
  /** メンバーの名前 */
  name: string;
  /** メンバーのアバター画像URL（オプション） */
  avatar?: string;
};

/**
 * タスクのデータ構造を定義
 * タスクの基本情報と担当者情報を含む
 */
export type Task = {
  /** タスクの一意のID */
  id: string;
  /** タスクのタイトル */
  title: string;
  /** タスクの詳細説明 */
  description: string;
  /** タスクの状態（Todo、進行中、完了） */
  status: "todo" | "in-progress" | "done";
  /** タスクの優先度（オプション） */
  priority?: "low" | "medium" | "high";
  /** タスクの担当者（オプション） */
  assignee?: TeamMember;
};

/**
 * カラム定義の型
 */
export type KanbanColumn = {
  /** カラムの一意のID */
  id: string;
  /** カラムのタイトル */
  title: string;
  /** カラムに対応するタスクのステータス */
  status: Task["status"];
};
