import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useRef, useState } from "react";
import { useTodos } from "../features/todos/hooks/useTodos";
import { useLists } from "../features/todos/hooks/useLists";
import {
  MdKeyboardArrowLeft,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { FaRegTrashAlt, FaUsers } from "react-icons/fa";
import { TbSquareCheckFilled } from "react-icons/tb";
import { ShareListModal } from "../features/todos/components/ShareListModal";
import { motion } from "framer-motion";
import LogUser from "../components/layout/userMenu/LogUser";
import { MembersInList } from "../features/todos/components/Table.MembersInList";
import { containerVariants, itemVariants } from "../utils/motionVariants";
import { FaSquarePlus } from "react-icons/fa6";
import { ErrorMessage } from "../components/ui/errorMessage/ErrorMessage";

export const ToDo = () => {
  const { listId } = useParams<{ listId: string }>();
  const { user } = useAuth();
  const { lists } = useLists();
  const {
    todos,
    memberRole,
    addMutation,
    pendingMutation,
    confirmMutation,
    deleteMutation,
  } = useTodos(listId || null);
  /* sino es miembro indicar que ya no pertenece a listado y habilitar boton para retornar a Dashboard */
  const taskRef = useRef<HTMLInputElement | null>(null);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const currentList = lists.find((item) => item.id === listId);
  const listName = currentList?.name?.toUpperCase() || "";

  const statusOrder: Record<string, number> = {
    pending: 1,
    done_by_user: 2,
    confirmed: 3,
  };

  const sortedTodos = [...todos].sort(
    (a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99),
  );
  const isOwner = currentList?.owner_id === user?.id;
  const isEditor = isOwner || memberRole === "write";
  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const textValue = taskRef.current?.value.trim() || "";

    // Si está vacío, excede caracteres o faltan datos de sesión, cancela la acción
    if (!textValue || textValue.length > 29 || !listId || !user) {
      return;
    }

    addMutation.mutate({
      list_id: listId,
      task: newTaskText,
      created_by: user.id,
    });

    setNewTaskText("");
  };

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
      <section className="pt-6 flex flex-col">
        <Link
          className="text-xs text-gray-300 font-medium absolute top-1 left-2 flex items-center bg-gray-900 p-2 rounded-md hover:opacity-80"
          to={"/dashboard"}
        >
          <MdKeyboardArrowLeft className="w-4 h-4 text-gray-300" />
          <span>Volver</span>
        </Link>
        <LogUser />

        <div className="absolute top-1 right-12 bg-gray-900 rounded-full cursor-pointer p-2 hover:bg-gray-800 transition-colors">
          <FaUsers
            className="h-5 w-5 text-gray-300 hover:text-white"
            onClick={() => setIsMembersModalOpen(true)}
            title="Ver miembros"
          />
        </div>

        {isOwner && (
          <div className="absolute top-1 right-22 bg-gray-900 rounded-full cursor-pointer p-2 hover:bg-gray-800 transition-colors">
            <FiShare2
              className="h-5 w-5 text-gray-300 hover:text-white"
              onClick={() => setIsShareModalOpen(true)}
              title="Compartir lista"
            />
          </div>
        )}

        <h1 className="text-center text-4xl my-8 font-medium">{listName}</h1>
        <form
          onSubmit={handleAddTask}
          className="self-center items-center flex gap-1 bg-gray-900 border border-gray-500 rounded-md p-2"
        >
          <input
            className="outline-none text-xl p-2"
            autoFocus
            ref={taskRef}
            value={newTaskText}
            onChange={() => setNewTaskText(taskRef.current!.value)}
            maxLength={30}
            placeholder="Añadir tarea..."
          />
          <FaSquarePlus
            className="w-11 h-11 cursor-pointer"
            color="#51a2ff"
            onClick={handleAddTask}
          />
        </form>
        {newTaskText.length >= 30 && (
          <ErrorMessage message={"Excedes el maximo de caracteres (30max)"} />
        )}

        <motion.ul
          variants={containerVariants}
          className="mt-10"
          initial="hidden"
          animate="visible"
        >
          {/*  {isLoading && <Loader classContainer="absolute mx-[35%] top-[25%]"/>} TODO!! Algo mas suave en la interfaz*/}
          {sortedTodos.map((todo) => (
            <motion.div
              variants={itemVariants}
              key={todo.id}
              className={`my-3 flex justify-between items-stretch gap-2 bg-gray-950 rounded-md border ${
                borderColors[todo.status]
              }`}
            >
              {isEditor && (
                <button
                  type="button"
                  className="border-r border-r-gray-700 flex items-center justify-center px-2"
                  onClick={() => deleteMutation.mutate(todo.id)}
                >
                  <FaRegTrashAlt className="text-red-500 hover:text-red-700 rounded-md transition-colors cursor-pointer opacity-60" />
                </button>
              )}

              <li
                className="w-full flex gap-2 items-center p-4 cursor-pointer"
                onClick={() => handleMutation(todo.id, todo.status)}
              >
                <span className="ml-1 flex-1 text-[1.1rem]">{todo.task}</span>
                {todo.status === "pending" && (
                  <MdOutlineCheckBoxOutlineBlank className="text-[#e8e7e9] w-6 h-7 mr-1 cursor-pointer" />
                )}

                {todo.status === "confirmed" && (
                  <TbSquareCheckFilled className="text-green-500 w-6 h-7 mr-1 cursor-pointer" />
                )}
              </li>
            </motion.div>
          ))}
        </motion.ul>
        <div>
          {listId && (
            <ShareListModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              listId={listId}
              listName={listName}
            />
          )}

          {isMembersModalOpen && currentList && (
            <MembersInList
              listOwner={currentList.owner_nickname}
              listName={currentList.name}
              listId={currentList.id}
              listMembers={currentList.members}
              isOwner={isOwner}
              onClose={setIsMembersModalOpen}
            />
          )}
        </div>
      </section>
    </>
  );
};
