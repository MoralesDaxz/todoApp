import { motion } from "framer-motion";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { TbSquareCheckFilled } from "react-icons/tb";
import { containerVariants, itemVariants } from "../../../utils/motionVariants";
import type { Todo as TodoType } from "../../types";
import { useTodos } from "../hooks/useTodos";
import { useParams } from "react-router";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

import { formatRelativeTime } from "../../../utils/date";

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

  const borderColors = {
    pending: "border-[#e8e7e9c9] shadow shadow-[#e8e7e9c9]",
    done_by_user: "border-[#ff8903b2] shadow shadow-[#ff8903b2]",
    confirmed: "border-[#4ff00fd2] shadow shadow-[#4ff00fd2]",
  };
  const handleMutation = (id: string, status: string) => {
    //- owner - pending -> confirmed
    //- !owner - pending -> done_by_user -> owner -> confirmed
    //- "done_by_user" es un flag de control en caso de implementar el owner como supervisor
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
  };

  return (
    <>
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {todos.map((todo) => (
          <motion.div
            variants={itemVariants}
            key={todo.id}
            className={`w-[90%] mx-auto my-3 flex justify-between items-stretch gap-2 bg-gray-950 rounded-md border ${
              borderColors[todo.status]
            }`}
          >
            {isEditor && isOnline && (
              <button
                type="button"
                className="border-r border-r-gray-700 flex items-center justify-center px-2"
                onClick={() => deleteMutation.mutate(todo.id)}
              >
                <FaRegTrashAlt className="text-red-500 hover:text-red-700 rounded-md transition-colors cursor-pointer opacity-60" />
              </button>
            )}

            <li
              className="w-full flex flex-col justify-end pt-3 gap-1 items-center cursor-pointer"
              onClick={() => handleMutation(todo.id, todo.status)}
            >
              <div className="flex justify-between items-end w-full">
                <span className="ml-1 text-[1.1rem]">{todo.task}</span>
                {todo.status === "pending" && (
                  <MdOutlineCheckBoxOutlineBlank className="text-[#e8e7e9] w-6 h-7 mr-1 cursor-pointer" />
                )}

                {todo.status === "confirmed" && (
                  <TbSquareCheckFilled className="text-green-500 w-6 h-7 mr-1 cursor-pointer" />
                )}
              </div>
              <span className="flex justify-end w-full">
                <p className="text-[10px] mr-1">
                  {formatRelativeTime(todo.created_at)}
                </p>
              </span>
            </li>
          </motion.div>
        ))}
      </motion.ul>
    </>
  );
};
