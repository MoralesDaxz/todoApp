import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTodos } from "../features/todos/hooks/useTodos";
import { useLists } from "../features/todos/hooks/useLists";



export const ToDo = () => {
  const { listId } = useParams<{ listId: string }>();
  const { user } = useAuth();
  const { todos, isLoading, addMutation, markAsDoneMutation, confirmMutation } =
    useTodos(listId || null);
  const { lists } = useLists();
  const [newTaskText, setNewTaskText] = useState("");



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
    <div className="w-full p-2">
      <Link className="absolute top-1 left-2" to={"/dashboard"}>
        Volver
      </Link>
      <h1>{listName}</h1>

      <div className="flex gap-1 my-3 border-2 border-gray-400 rounded-sm">
        <input
          className="outline-none p-2 text-xl"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          placeholder="Añadir tarea..."
        />
        <button
          className="bg-blue-400 text-white rounded-r-xs text-sm p-3 font-medium"
          onClick={handleAddTask}
        >
          Añadir
        </button>
      </div>

      <ul>
        {todos.map((todo) => {
          // Evaluamos el estado AQUÍ, para cada "todo" individual

          return (
            <li
              className="my-1 border-2 border-gray-600 rounded-sm flex gap-2 items-center"
              key={todo.id}
            >
              {/* <span className="text-sm text-gray-400">{statusMsg}</span> */}
              <span className="ml-1 flex-1">{todo.task}</span>
              {todo.status === "confirmed" && (
                <button
                  className="bg-gray-500 text-white opacity-90 text-sm font-medium p-2 rounded-r-xs"
                  onClick={() => markAsDoneMutation.mutate(todo.id)}
                >
                  Hecho
                </button>
              )}
              {todo.status === "pending" && (
                <button
                  className="bg-yellow-500 text-white text-sm font-medium p-2 rounded-r-xs"
                  onClick={() => markAsDoneMutation.mutate(todo.id)}
                >
                  Aprobar
                </button>
              )}
              {todo.status === "done_by_user" && (
                <button
                  className="bg-green-500 text-white text-sm font-medium p-2 rounded-r-xs"
                  onClick={() => confirmMutation.mutate(todo.id)}
                >
                  Confirmar
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
