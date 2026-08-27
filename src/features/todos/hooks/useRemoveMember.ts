// src/features/todos/hooks/useRemoveMember.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMemberFromList } from "../api/shareService";
import { useAuth } from "../../../context/AuthContext";

export const useRemoveMember = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, userId }: { listId: string; userId: string }) =>
      removeMemberFromList(listId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", user?.id] });
    },
  });
};