import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTodos } from "../features/todos/hooks/useTodos";
import { useLists } from "../features/todos/hooks/useLists";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsPlusCircleFill } from "react-icons/bs";
export const ToDo = () => {
  const { listId } = useParams<{ listId: string }>();
  const { user } = useAuth();
  const { todos, isLoading, addMutation, markAsDoneMutation, confirmMutation } =
    useTodos(listId || null);
  const { lists } = useLists();
  const [newTaskText, setNewTaskText] = useState("");
console.log("Listas",lists);
console.log("listId",listId);
console.log("todos",todos);

  const handleAddTask = () => {
    if (!newTaskText.trim() || !listId || !user) return;
    addMutation.mutate({
      list_id: listId,
      task: newTaskText,
      created_by: user.id,
    });
    setNewTaskText("");
  };

  // Corrección vital: usar ?. para evitar que la app se rompa si lists aún no tiene datos
  const listName =
    lists.find((item) => item.id === listId)?.name?.toUpperCase() ||
    "CARGANDO...";

  if (isLoading) return <div>Cargando...</div>;

  return (
    <section className="w-full px-6 pt-4 flex flex-col">
      <Link
        className="text-xs font-medium absolute top-1 left-2 flex items-center bg-gray-500 p-1 rounded-md hover:opacity-80"
        to={"/dashboard"}
      >
        <MdKeyboardArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </Link>
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
        {todos.map((todo) => {
          // Evaluamos el estado AQUÍ, para cada "todo" individual

          return (
            <li
              className="my-2 border-2 border-gray-600 rounded-sm flex gap-2 items-center backdrop-brightness-80 shadow-2xl"
              key={todo.id}
            >
              {/* <span className="text-sm text-gray-400">{statusMsg}</span> */}
              <span className="ml-1 flex-1 text-[1.1rem]">{todo.task}</span>
              {todo.status === "confirmed" && (
                <button
                  className="bg-gray-500 text-white opacity-90 text-sm font-medium p-3 rounded-r-xs"
                  onClick={() => markAsDoneMutation.mutate(todo.id)}
                >
                  Hecho
                </button>
              )}
              {todo.status === "pending" && (
                <button
                  className="bg-yellow-500 text-white text-sm font-medium p-3 rounded-r-xs"
                  onClick={() => markAsDoneMutation.mutate(todo.id)}
                >
                  Aprobar
                </button>
              )}
              {todo.status === "done_by_user" && (
                <button
                  className="bg-green-500 text-white text-sm font-medium p-3 rounded-r-xs"
                  onClick={() => confirmMutation.mutate(todo.id)}
                >
                  Confirmar
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
