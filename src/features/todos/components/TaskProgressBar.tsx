import { motion } from "framer-motion";
import type { Todo } from "../../types";


interface Props {
  todos: Todo[];
}

export const TaskProgressBar = ({ todos }: Props) => {
  const total = todos.length;
  if (total === 0) return null;

  const completed = todos.filter((t) => t.status === "confirmed").length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full bg-gray-950 border border-gray-800 px-3 py-2 rounded-xl shadow-md my-3">
      {/* Pista de la barra */}
      <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-800">
        {/* Relleno animado */}
        <motion.div
          className="bg-linear-to-r from-blue-600 to-green-500 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between items-center mt-2 text-[11px] text-gray-400">
        <>
          <span>
            {completed} de {total}{" "}
            {total === 1 ? "tarea completada" : "tareas completadas"}
          </span>

          <span className="text-blue-400 font-bold">{percentage}%</span>
        </>
        {percentage === 100 && (
          <>
            <span className="text-green-400 font-semibold animate-pulse">
              ¡Lista completada!
            </span>
            <span className="text-blue-400 font-bold">{percentage}%</span>
          </>
        )}
      </div>
    </div>
  );
};
