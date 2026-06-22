import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTodos } from "../features/todos/hooks/useTodos";
import { useLists } from "../features/todos/hooks/useLists";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabase/supabaseClient";

export const ToDo = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { todos, fetchTodos, markAsDoneByUser, confirmTodo } = useTodos(
    listId || null,
  );
  const { generateInviteCode } = useLists();

  const [listDetails, setListDetails] = useState<{
    name: string;
    owner_id: string;
  } | null>(null);
  const [newTaskText, setNewTaskText] = useState("");

  // Cargar detalles de la lista al entrar
  useEffect(() => {
    if (!listId) return;
    fetchTodos();

    supabase
      .from("lists")
      .select("name, owner_id")
      .eq("id", listId)
      .single()
      .then(({ data }) => {
        if (data) setListDetails(data);
      });
  }, [listId, fetchTodos]);

  const isOwner = listDetails?.owner_id === user?.id;

  const handleGenerateCode = async (role: "read" | "write") => {
    if (!listId) return;
    const code = await generateInviteCode(listId, role);
    if (code) {
      navigator.clipboard.writeText(code);
      alert(
        `Código copiado al portapapeles:\n${code}\nComparte esto con tu invitado.`,
      );
    }
  };

  const handleAddTask = async () => {
    if (!newTaskText.trim() || !listId || !user) return;
    await supabase.from("todos").insert([
      {
        list_id: listId,
        task: newTaskText,
        status: "pending",
        created_by: user.id,
      },
    ]);
    setNewTaskText("");
    fetchTodos();
  };

  if (!listDetails) return <div>Cargando lista...</div>;

  return (
    <div className="p-5 max-w-[800px] mx-auto">
      <button className="mb-4" onClick={() => navigate("/dashboard")}>
        ← Volver al Dashboard
      </button>

      <div className="flex flex-col items-center">
        <h1>{listDetails.name}</h1>

        {/* Solo el dueño puede generar códigos */}
        {isOwner && (
          <div className=" my-4">
            <button onClick={() => handleGenerateCode("read")}>
              Invitar Lector 🕶
            </button>
            <button
              className="ml-2.5"
              onClick={() => handleGenerateCode("write")}
            >
              Invitar Escritor 📝
            </button>
          </div>
        )}
      </div>

      <div className="mb-5">
        <input
          className="border p-2 mr-2"
          value={newTaskText}
          onKeyDown={(e) => e.key == "Enter" && handleAddTask()}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Añadir nueva tarea..."
        />
        <button onClick={handleAddTask}>Añadir</button>
      </div>

      <ul className="list-none p-0">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="border border-[#ddd] p-[15px] mb-[10px] rounded"
          >
            <div className="flex justify-between">
              <span>{todo.task}</span>
              <span>
                Estado: <strong>{todo.status}</strong>
              </span>
            </div>

            <div className="mt-[10px]">
              {/* REGLA: Cualquiera puede marcar como realizado si está pendiente */}
              {todo.status === "pending" && (
                <button onClick={() => markAsDoneByUser(todo.id)}>
                  Marcar como Realizado
                </button>
              )}

              {/* REGLA: SOLO el dueño puede confirmar el cierre */}
              {todo.status === "done_by_user" && isOwner && (
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => confirmTodo(todo.id)}
                >
                  Confirmar Cierre Final
                </button>
              )}

              {/* Mensaje para invitados mientras esperan al dueño */}
              {todo.status === "done_by_user" && !isOwner && (
                <span className="text-orange-500 text-[0.9em]">
                  Esperando confirmación del creador...
                </span>
              )}
            </div>
          </li>
        ))}
        {todos.length === 0 && <p>No hay tareas en esta lista.</p>}
      </ul>
    </div>
  );
};
