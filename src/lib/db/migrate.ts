import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

// このスクリプトはマイグレーションを実行するためのものです
async function main() {
  console.log('Migration started...');

  const pool = new Pool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'kanban',
  });

  const db = drizzle(pool);

  // マイグレーションを実行
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed successfully');

  // 接続を閉じる
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed');
  console.error(err);
  process.exit(1);
});
