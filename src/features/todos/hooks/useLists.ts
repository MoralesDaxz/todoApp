// features/todos/hooks/useLists.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLists, createList, deleteListService } from "../api/listService";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";

export const useLists = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [deletingListId, setDeletingListId] = useState<string | null>(null);

  const { data: lists = [], isLoading } = useQuery({
    queryKey: ["lists", user?.id],
    queryFn: () => getLists(),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createList(name, user!.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["lists", user?.id] }),
  });

  const deleteList = async (
    listId: string
  ): Promise<{ success: boolean; error?: string }> => {
    setDeletingListId(listId);
    try {
      await deleteListService(listId);

      // Invalidamos la caché para que React Query vuelva a sincronizar las listas
      await queryClient.invalidateQueries({ queryKey: ["lists", user?.id] });

      return { success: true };
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "No se pudo eliminar la lista";
      return { success: false, error: msg };
    } finally {
      setDeletingListId(null);
    }
  };

  return { lists, isLoading, createMutation, deleteList, deletingListId };
};