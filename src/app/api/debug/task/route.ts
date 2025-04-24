import { createTask } from '@/lib/actions/kanban';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();
    
    // 明示的なデバッグポイント
    debugger;
    
    console.log('Debug API received:', body);
    
    // サーバーアクションを呼び出し
    const result = await createTask({
      title: body.title || 'Debug Task',
      description: body.description || 'Created from debug API',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      assigneeId: body.assigneeId,
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Failed to create task', details: String(error) },
      { status: 500 }
    );
  }
}
