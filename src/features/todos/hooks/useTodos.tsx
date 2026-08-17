import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../config/supabase/supabaseClient";
import { fetchTodos, addTodo } from "../api/todoService";
import { useAuth } from "../../../context/AuthContext";

export interface Todo {
  id: string;
  list_id: string;
  task: string;
  status: "pending" | "done_by_user" | "confirmed";
  created_by: string;
  created_at?: string; 
}

export const useTodos = (listId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Consulta el rol del usuario en la lista activa
  const { data: memberRole } = useQuery({
    queryKey: ["list_role", listId, user?.id],
    queryFn: async () => {
      if (!listId || !user?.id) return null;
      const { data } = await supabase
        .from("list_members")
        .select("role")
        .eq("list_id", listId)
        .eq("user_id", user.id)
        .maybeSingle();
      return data?.role || null; // 'read' | 'write' | null
    },
    enabled: !!listId && !!user?.id,
  });

  const { data: todos = [], isLoading } = useQuery<Todo[], Error>({
    queryKey: ["todos", listId],
    queryFn: () => fetchTodos(listId!),
    enabled: !!listId,
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", listId] });
    },
  });

  
  const markAsDoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("todos")
        .update({ status: "done_by_user" })
        .eq("id", id)
        .select(); 

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


  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", listId] });
    },
  });

  const renameMutation = useMutation({
    // Recibe un objeto con el ID de la tarea y el nuevo texto
    mutationFn: async ({ id, newTask }: { id: string; newTask: string }) => {
      const { data, error } = await supabase
        .from("todos")
        .update({ task: newTask })
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
    deleteMutation,
    renameMutation,
    memberRole 
  };
};