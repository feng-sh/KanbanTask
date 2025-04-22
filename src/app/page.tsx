"use client";

import KanbanPage from "./kanban/page";

/**
 * ホームページコンポーネント
 * カンバンボードをホームページに表示します
 */
const Home = () => {
  return (
    <div className="min-h-screen p-8">
      <KanbanPage />
    </div>
  );
};

export default Home;
