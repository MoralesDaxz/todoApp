import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTodos } from "../features/todos/hooks/useTodos";
import { useLists } from "../features/todos/hooks/useLists";

type TodoStatus = "confirmed" | "pending" | "done_by_user";

export const ToDo = () => {
  const { listId } = useParams<{ listId: string }>();
  const { user } = useAuth();
  const { todos, isLoading, addMutation, markAsDoneMutation, confirmMutation } = useTodos(listId || null);
  const { lists } = useLists();
  const [newTaskText, setNewTaskText] = useState("");

  const statusIcons: Record<TodoStatus, string> = {
    confirmed: "✅",
    pending: "⌛",
    done_by_user: "✋🏻",
  };

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
  const listName = lists.find(item => item.id === listId)?.name?.toUpperCase() || "CARGANDO...";

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="w-full p-2">
      <h1>{listName}</h1>
      
      <input
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        placeholder="Añadir tarea..."
      />
      <button onClick={handleAddTask}>Añadir</button>

      <ul>
        {todos.map((todo) => {
          // Evaluamos el estado AQUÍ, para cada "todo" individual
          const statusMsg = statusIcons[todo.status as TodoStatus] || "❓";

          return (
            <li className="my-4 border-2 border-gray-400 rounded-md flex gap-4 items-center" key={todo.id}>
              <span className="text-sm text-gray-400">{statusMsg}</span>
              <span className="flex-1">{todo.task}</span>
              
              {todo.status === "pending" && (
                <button 
                  className="bg-blue-600 text-white rounded-md"
                  onClick={() => markAsDoneMutation.mutate(todo.id)}
                >
                 {statusMsg} Realizado
                </button>
              )}
              {todo.status === "done_by_user" && (
                <button 
                  className="bg-yellow-600 text-white rounded-md"
                  onClick={() => confirmMutation.mutate(todo.id)}
                >
                 {statusMsg} Confirmar
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};