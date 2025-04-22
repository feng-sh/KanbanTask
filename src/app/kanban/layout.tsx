/**
 * カンバンレイアウトコンポーネント
 */
const KanbanLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="container mx-auto max-w-7xl">{children}</div>;
};

export default KanbanLayout;
