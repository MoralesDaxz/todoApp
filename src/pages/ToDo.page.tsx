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
import { GrEdit } from "react-icons/gr";
import { TbSquareCheckFilled, TbUserPause } from "react-icons/tb";

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
    renameMutation,
  } = useTodos(listId || null);

  const [newTaskText, setNewTaskText] = useState("");

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
  if (isLoading) return <div>Cargando...</div>;

  return (
    <section className="px-6 pt-4 flex flex-col">
      <Link
        className="text-xs font-medium absolute top-1 left-2 flex items-center bg-gray-500 p-1 rounded-md hover:opacity-80"
        to={"/dashboard"}
      >
        <MdKeyboardArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </Link>
      <FiShare2 className="absolute top-1 right-2 w-5 h-5 text-gray-400" />
      <h1 className="text-center text-4xl my-8 font-medium">{listName}</h1>
      <article className="self-center items-center flex gap-1 border-2 border-gray-400  rounded-md bg-gray-700 p-1">
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

      <ul className="mt-10">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="my-2 flex justify-between items-stretch gap-2"
          >
            {/* Solo Creador o Editor pueden ELIMINAR y RENOMBRAR */}
            {isEditor && (
              <>
                <button
                  type="button"
                  className="bg-gray-300 flex items-center justify-center px-2 rounded-md border border-gray-300"
                  onClick={() => deleteMutation.mutate(todo.id)}
                >
                  <FaRegTrashAlt className="text-gray-800" />
                </button>
                <button
                  type="button"
                  className="bg-gray-300 flex items-center justify-center px-2 rounded-md border border-gray-300"
                  onClick={() => {
                    const newText = prompt("Edita la tarea:", todo.task);
                    if (newText && newText.trim() !== "") {
                      renameMutation.mutate({ id: todo.id, newTask: newText });
                    }
                  }}
                >
                  <GrEdit className="text-gray-800 h-6 w-5" />
                </button>
              </>
            )}

            <li
              className={`w-full border-2 backdrop-brightness-80 shadow-2xl rounded-md flex gap-2 items-center h-12 transition-colors ${
                borderColors[todo.status]
              }`}
            >
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
          </div>
        ))}
      </ul>
    </section>
  );
};
