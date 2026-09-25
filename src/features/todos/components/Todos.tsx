import { AnimatePresence, motion } from "framer-motion";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { TbLoader4, TbSquareCheckFilled } from "react-icons/tb";
import { containerVariants, itemVariants } from "../../../utils/motionVariants";
import type { Todo as TodoType } from "../../types";
import { useTodos } from "../hooks/useTodos";
import { useParams } from "react-router";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { formatRelativeTime } from "../../../utils/date";
import { useState } from "react";
import { sleep } from "../../../utils/sleep";


interface Props {
  todos: TodoType[];
  isEditor: boolean;
}

export const Todos = ({ todos, isEditor }: Props) => {
  const isOnline = useOnlineStatus();
  const { listId } = useParams<{ listId: string }>();
  const { pendingMutation, confirmMutation, deleteMutation } = useTodos(
    listId || null,
  );

  const [loadingTodoId, setLoadingTodoId] = useState<string | null>(null);
  const borderColors = {
    pending: "border-[#e8e7e9c9] shadow shadow-[#e8e7e9c9]",
    done_by_user: "border-[#ff8903b2] shadow shadow-[#ff8903b2]",
    confirmed: "border-[#4ff00fd2] shadow shadow-[#4ff00fd2]",
  };
  const handleMutation = async (id: string, status: string) => {
    if (loadingTodoId === id) return;

    setLoadingTodoId(id);

    // Disparamos la mutación correspondiente
    switch (status) {
      case "pending":
        confirmMutation.mutate(id);
        break;
      case "confirmed":
        pendingMutation.mutate(id);
        break;
      default:
        break;
    }

    // Mantenemos el loader visible por 300ms para dar la respuesta visual
    await sleep(300);

    // Quitamos el loader
    setLoadingTodoId(null);
  };

  return (
    <>
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      
      >
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => {
            const isLoading = loadingTodoId === todo.id;
            return (
              <motion.div
                layout
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }} // Anima la desaparición/salida
                transition={{
                  layout: { type: "spring", stiffness: 350, damping: 25 },
                  opacity: { duration: 0.2 },
                }}
                key={todo.id}
                className={`mb-4 flex justify-between items-stretch gap-2 bg-gray-950 rounded-md border ${
                  borderColors[todo.status]
                }`}
              >
                {isEditor && isOnline && (
                  <button
                    type="button"
                    className="border-r border-r-gray-700 flex items-center justify-center px-2"
                    onClick={() => deleteMutation.mutate(todo.id)}
                    disabled={isLoading}
                  >
                    <FaRegTrashAlt className="text-red-500 hover:text-red-700 rounded-md transition-colors cursor-pointer opacity-60" />
                  </button>
                )}

                <li
                  className="w-full flex flex-col justify-end pt-3 gap-1 items-center cursor-pointer"
                  onClick={() => handleMutation(todo.id, todo.status)}
                >
                  <button className="relative flex justify-between items-end w-full">
                    <span className="ml-1 text-[1.1rem]">{todo.task}</span>
                    {isLoading ? (
                      <TbLoader4 className="text-amber-400 w-6 h-7 mr-1 animate-spin" />
                    ) : (
                      <>
                        {todo.status === "pending" && (
                          <MdOutlineCheckBoxOutlineBlank className="text-[#e8e7e9] w-6 h-7 mr-1 cursor-pointer" />
                        )}
                        {todo.status === "confirmed" && (
                          <TbSquareCheckFilled className="text-green-500 w-6 h-7 mr-1 cursor-pointer" />
                        )}
                      </>
                    )}
                  </button>
                  <span className="flex justify-end w-full">
                    <p className="text-[11px] mr-1">
                      {formatRelativeTime(todo.created_at)}
                    </p>
                  </span>
                </li>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.ul>
     
    </>
  );
};
