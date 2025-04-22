import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// スキーマとリレーションをインポート
import * as schema from './schema';

// データベース接続プールの設定
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'kanban',
});

// Drizzle ORMのインスタンスを作成（クエリビルダーを含む）
export const db = drizzle(pool, { schema });

// 接続プールをエクスポート（必要に応じて直接クエリを実行するため）
export { pool };
