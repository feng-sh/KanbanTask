import { db } from './index';
import { teamMembers, columns, tasks } from './schema';

// このスクリプトは初期データを投入するためのものです
async function seed() {
  console.log('Seeding database...');

  try {
    // チームメンバーの初期データを挿入
    console.log('Inserting team members...');
    const insertedMembers = await db.insert(teamMembers).values([
      {
        userId: 'user-1',
        name: 'Alex Johnson',
        avatar: 'https://ui.shadcn.com/avatars/01.png',
      },
      {
        userId: 'user-2',
        name: 'Sam Wilson',
        avatar: 'https://ui.shadcn.com/avatars/02.png',
      },
      {
        userId: 'user-3',
        name: 'Taylor Kim',
        avatar: 'https://ui.shadcn.com/avatars/03.png',
      },
      {
        userId: 'user-4',
        name: 'Jordan Lee',
        avatar: 'https://ui.shadcn.com/avatars/04.png',
      },
      {
        userId: 'user-5',
        name: 'Casey Morgan',
        avatar: 'https://ui.shadcn.com/avatars/05.png',
      },
    ]).returning();

    // カラムの初期データを挿入
    console.log('Inserting columns...');
    await db.insert(columns).values([
      { title: 'Todo', status: 'todo' },
      { title: '進行中', status: 'in-progress' },
      { title: '完了', status: 'done' },
    ]);

    // メンバーIDのマッピングを作成
    const memberMap = new Map(insertedMembers.map(member => [member.userId, member.id]));

    // タスクの初期データを挿入
    console.log('Inserting tasks...');
    await db.insert(tasks).values([
      {
        title: 'Research competitors',
        description: 'Analyze top 5 competitors in the market',
        status: 'todo',
        priority: 'high',
        assigneeId: memberMap.get('user-1'),
      },
      {
        title: 'Design homepage',
        description: 'Create wireframes for the new homepage',
        status: 'todo',
        priority: 'medium',
        assigneeId: memberMap.get('user-2'),
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing',
        status: 'in-progress',
        priority: 'high',
        assigneeId: memberMap.get('user-3'),
      },
      {
        title: 'Implement authentication',
        description: 'Add user login and registration functionality',
        status: 'in-progress',
        priority: 'medium',
        assigneeId: memberMap.get('user-4'),
      },
      {
        title: 'Write documentation',
        description: 'Create user guide for the admin panel',
        status: 'done',
        priority: 'low',
        assigneeId: memberMap.get('user-5'),
      },
      {
        title: 'Fix navigation bug',
        description: 'Resolve issue with dropdown menu on mobile',
        status: 'done',
        priority: 'high',
        assigneeId: memberMap.get('user-1'),
      },
    ]);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// スクリプトを実行
seed().catch((err) => {
  console.error('Seeding failed');
  console.error(err);
  process.exit(1);
});
