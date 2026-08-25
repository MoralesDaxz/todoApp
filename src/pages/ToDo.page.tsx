import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTodos } from "../features/todos/hooks/useTodos";
import { useLists } from "../features/todos/hooks/useLists";
import {
  MdKeyboardArrowLeft,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineLibraryAddCheck,
} from "react-icons/md";
import { BsPlusCircleFill } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

import { TbSquareCheckFilled, TbUserPause } from "react-icons/tb";
import { ShareListModal } from "../features/todos/components/ShareListModal";
import LogUser from "../components/UI/logUser/LogUser";
import { motion, type Variants } from "framer-motion";

export const ToDo = () => {
  const { listId } = useParams<{ listId: string }>();
  const { user } = useAuth();
  const { lists } = useLists();
  const {
    todos,
    isLoading,
    memberRole,
    addMutation,
    markAsDoneMutation,
    confirmMutation,
    deleteMutation,
  } = useTodos(listId || null);
  console.log(todos);
  

  const [newTaskText, setNewTaskText] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // Obtener la lista actual para verificar el creador
  const currentList = lists.find((item) => item.id === listId);
  const listName = currentList?.name?.toUpperCase() || "CARGANDO...";

  // Lógica de Roles
  const isOwner = currentList?.owner_id === user?.id;
  const isEditor = isOwner || memberRole === "write";

  const handleAddTask = () => {
    if (!newTaskText.trim() || !listId || !user) return;
    addMutation.mutate({
      list_id: listId,
      task: newTaskText,
      created_by: user.id,
    });
    setNewTaskText("");
  };
  const borderColors = {
    pending: "border-[#f5f23a9a]",
    done_by_user: "border-[#ff8903b2]",
    confirmed: "border-[#53e7188a]",
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Tiempo en segundos entre cada tarjeta
      },
    },
  };

  // 2. Variante para cada tarjeta (Hijo)
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50 }, // Entra desde -50px a la izquierda
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }, // Animación fluida
    },
  };
  if (isLoading) return <div>Cargando...</div>;

  return (
    <section className="max-w-2xl mx-auto px-6 pt-4 flex flex-col">
      <Link
        className="text-xs text-gray-300 font-medium absolute top-1 left-2 flex items-center bg-gray-900 p-2 rounded-md hover:opacity-80"
        to={"/dashboard"}
      >
        <MdKeyboardArrowLeft className="w-4 h-4 text-gray-300" />
        <span>Volver</span>
      </Link>
      <LogUser />
      {isOwner && (
        <div className="absolute top-1 right-12 bg-gray-900 rounded-[50%] cursor-pointer p-2">
          <FiShare2
            className="h-5 w-5 text-gray-300 hover:text-white "
            onClick={() => setIsShareModalOpen(true)}
          />
        </div>
      )}
      <h1 className="text-center text-4xl my-8 font-medium">{listName}</h1>
      <article className="self-center items-center flex gap-1  bg-gray-900 border border-gray-500 rounded-md p-2">
        <input
          className="outline-none text-xl p-2"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleAddTask() : null)}
          placeholder="Añadir tarea..."
        />

        <BsPlusCircleFill
          className=" w-11 h-11 "
          color="#51a2ff"
          onClick={handleAddTask}
        />
      </article>

      {/* Solo el dueño puede generar códigos */}
      {
        <motion.ul
          variants={containerVariants}
          className="mt-10"
          initial="hidden"
          animate="visible"
        >
          {todos.map((todo) => (
            <motion.div
              variants={itemVariants} 
              key={todo.id}
              className={`my-2 flex justify-between items-stretch gap-2 bg-gray-950 rounded-md border ${
                borderColors[todo.status]
              }`}
            >
              {/* Solo Creador o Editor pueden ELIMINAR y RENOMBRAR */}
              {isEditor && (
                <>
                  <button
                    type="button"
                    className="border-r border-r-gray-700 flex items-center justify-center px-2"
                    onClick={() => deleteMutation.mutate(todo.id)}
                  >
                    <FaRegTrashAlt className="text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-md transition-colors disabled:opacity-50 cursor-pointer" />
                  </button>
                </>
              )}

              <li className={`w-full flex gap-2 items-center p-4 `}>
                <span className="ml-1 flex-1 text-[1.1rem]">{todo.task}</span>
                {/* Owner -> Confirma directamente */}
                {isOwner && todo.status === "pending" && (
                  <MdOutlineCheckBoxOutlineBlank
                    className="text-yellow-300 w-6 h-7 mr-1"
                    onClick={() => confirmMutation.mutate(todo.id)}
                  />
                )}

                {/* !Owner pending -> confirmed */}
                {!isOwner && todo.status === "pending" && (
                  <MdOutlineCheckBoxOutlineBlank
                    className="text-yellow-300 w-6 h-7 mr-1"
                    onClick={() => markAsDoneMutation.mutate(todo.id)}
                  />
                )}

                {/*Solo el CREADOR puede dar la confirmación final */}
                {isOwner && todo.status === "done_by_user" && (
                  <MdOutlineLibraryAddCheck
                    className="text-orange-400 w-6 h-7 mr-1"
                    onClick={() => confirmMutation.mutate(todo.id)}
                  />
                )}

                {/* Estados */}
                {todo.status === "done_by_user" && !isOwner && (
                  <TbUserPause className=" text-yellow-500 w-6 h-7 mr-1" />
                )}

                {todo.status === "confirmed" && (
                  <TbSquareCheckFilled className="text-green-500 w-6 h-7 mr-1" />
                )}
              </li>
            </motion.div>
          ))}
        </motion.ul>
      }
      {listId && (
        <ShareListModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          listId={listId}
          listName={listName}
        />
      )}
    </section>
  );
};
