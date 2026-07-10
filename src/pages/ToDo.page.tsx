import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTodos } from "../features/todos/hooks/useTodos";

export const ToDo = () => {
  const { listId } = useParams<{ listId: string }>();
  const { user } = useAuth();
  const { todos, isLoading, addMutation, markAsDoneMutation, confirmMutation } = useTodos(listId || null);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (!newTaskText.trim() || !listId || !user) return;
    addMutation.mutate({ list_id: listId, task: newTaskText, created_by: user.id });
    setNewTaskText("");
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="w-full p-2">
      {/* ... cabecera ... */}
      <input 
        value={newTaskText} 
        onChange={(e) => setNewTaskText(e.target.value)} 
        placeholder="Añadir tarea..."
      />
      <button onClick={handleAddTask}>Añadir</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.task} - {todo.status}
            {todo.status === 'pending' && (
              <button onClick={() => markAsDoneMutation.mutate(todo.id)}>Realizado</button>
            )}
            {todo.status === 'done_by_user' && (
              <button onClick={() => confirmMutation.mutate(todo.id)}>Confirmar</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};