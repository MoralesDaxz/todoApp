import { useTodos } from "../hooks/useTodos";

interface Props {
  listId: string;
}
export const MiniListTasksProgressBar = ({ listId }: Props) => {
  const { todos } = useTodos(listId || null);
  const total = todos.length;
  if (total === 0) return null;

  const completed = todos.filter((t) => t.status === "confirmed").length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <>
      {todos.length > 0 ? (
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>
              {completed}/{total} completadas
            </span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
