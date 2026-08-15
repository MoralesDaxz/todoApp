import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../config/supabase/supabaseClient";
import { fetchTodos, addTodo } from "../api/todoService";

export interface Todo {
  id: string;
  list_id: string;
  task: string;
  status: "pending" | "done_by_user" | "confirmed";
  created_by: string;
  created_at?: string; // Opcional dependiendo de si siempre lo pides en el select
}

export const useTodos = (listId: string | null) => {
  const queryClient = useQueryClient();

  // 1. SOLUCIÓN AL ERROR {...}: Configuración completa del Query
  const { data: todos = [], isLoading } = useQuery<Todo[], Error>({
    queryKey: ["todos", listId],
    queryFn: () => fetchTodos(listId!),
    enabled: !!listId, // Solo se ejecuta si hay un listId válido
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", listId] });
    },
  });

  // 2. SOLUCIÓN AL ERROR PostgrestFilterBuilder: Usar async/await
  const markAsDoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("todos")
        .update({ status: "done_by_user" })
        .eq("id", id)
        .select(); // El .select() es buena práctica para asegurar que devuelva la fila actualizada

      // Si Supabase devuelve un error, lo "lanzamos" para que React Query se entere de que la mutación falló
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", listId] });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("todos")
        .update({ status: "confirmed" })
        .eq("id", id)
        .select();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", listId] });
    },
  });

  return {
    todos,
    isLoading,
    addMutation,
    markAsDoneMutation,
    confirmMutation,
  };
};
