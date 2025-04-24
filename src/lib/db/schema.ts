import { pgTable, serial, text, varchar, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ステータスの列挙型を定義
export const statusEnum = pgEnum('status', ['todo', 'in-progress', 'done']);

// 優先度の列挙型を定義
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);

// チームメンバーテーブルの定義
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// カラムテーブルの定義
export const columns = pgTable('columns', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  status: statusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// タスクテーブルの定義
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: statusEnum('status').notNull(),
  priority: priorityEnum('priority').default('medium'),
  assigneeId: integer('assignee_id').references(() => teamMembers.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// リレーションの定義
export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(teamMembers, {
    fields: [tasks.assigneeId],
    references: [teamMembers.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ many }) => ({
  tasks: many(tasks),
}));
