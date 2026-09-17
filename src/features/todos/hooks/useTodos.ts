// src/features/todos/hooks/useTodos.ts
import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../config/supabase/supabaseClient";

export interface Todo {
  id: string;
  list_id: string;
  task: string;
  status: "pending" | "done_by_user" | "confirmed";
  created_by: string;
  created_at: string;
}

export const useTodos = (listId: string | null) => {
  const queryClient = useQueryClient();

  // 1. Obtención de las tareas asociadas a la lista activa
  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ["todos", listId],
    queryFn: async () => {
      if (!listId) return [];
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("list_id", listId)
        .order("created_at", { ascending: false }); // false: más recientes primero | true: más antiguas primero
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(listId),
  });

  // 2. Consulta del rol de miembro del usuario en la lista
  const { data: memberRole = null } = useQuery<string | null>({
    queryKey: ["memberRole", listId],
    queryFn: async () => {
      if (!listId) return null;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("list_members")
        .select("role")
        .eq("list_id", listId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.role ?? null;
    },
    enabled: Boolean(listId),
  });

  // 3. Suscripción en Tiempo Real (Supabase Realtime)
  useEffect(() => {
    if (!listId) return;

    // Sufijo único para evitar colisiones entre múltiples llamadas a useTodos
    const channelId = `todos-list-${listId}-${crypto.randomUUID().slice(0, 8)}`;

    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
          filter: `list_id=eq.${listId}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["todos", listId] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [listId, queryClient]);

  // 4. Mutación: Crear tarea + Persistencia
  const addMutation = useMutation({
    mutationFn: async (newTodo: {
      list_id: string;
      task: string;
      created_by: string;
    }) => {
      const { data, error } = await supabase
        .from("todos")
        .insert([newTodo])
        .select()
        .single();

      if (error) throw error;
      return data as Todo;
    },
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos", listId] });

      const previousTodos =
        queryClient.getQueryData<Todo[]>(["todos", listId]) || [];

      // ID temporal identificable
      const tempId = `temp-${crypto.randomUUID()}`;
      const tempTodo: Todo = {
        id: tempId,
        list_id: newTodo.list_id,
        task: newTodo.task,
        status: "pending",
        created_by: newTodo.created_by,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Todo[]>(["todos", listId], (old = []) => [
        ...old,
        tempTodo,
      ]);

      // Retornamos tempId en el contexto para poder encontrarlo en onSuccess
      return { previousTodos, tempId };
    },
    onSuccess: (serverTodo, _variables, context) => {
      // Reemplazamos de forma transparente la tarea temporal con los datos reales de la BD
      queryClient.setQueryData<Todo[]>(["todos", listId], (old = []) =>
        old.map((item) => (item.id === context?.tempId ? serverTodo : item)),
      );
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos", listId], context.previousTodos);
      }
    },
  });

  // 5. Mutación: Cambiar a estado "pending"
  const pendingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("todos")
        .update({ status: "pending" })
        .eq("id", id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["todos", listId] });
    },
  });

  // 6. Mutación: Cambiar a estado "confirmed"
  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("todos")
        .update({ status: "confirmed" })
        .eq("id", id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["todos", listId] });
    },
  });

  // 7. Mutación: Eliminar tarea
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["todos", listId] });
    },
  });

  return {
    todos,
    memberRole,
    addMutation,
    pendingMutation,
    confirmMutation,
    deleteMutation,
  };
};
