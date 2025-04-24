'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DebugPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Debug Task',
    description: 'Created for debugging',
    status: 'todo',
    priority: 'medium',
    assigneeId: undefined as string | undefined,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // デバッグAPIを呼び出し
      const response = await fetch('/api/debug/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error calling debug API:', error);
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">サーバーアクションデバッグページ</h1>
      
      <div className="grid gap-4 mb-6">
        <div>
          <label className="block mb-1">タイトル</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-1">説明</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-1">ステータス</label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">進行中</SelectItem>
              <SelectItem value="done">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block mb-1">優先度</label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleChange('priority', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'デバッグ中...' : 'デバッグ実行'}
      </Button>
      
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">結果:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
