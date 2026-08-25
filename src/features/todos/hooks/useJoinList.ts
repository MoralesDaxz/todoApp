// src/features/todos/hooks/useJoinList.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinListByCode } from "../api/shareService";
import { useAuth } from "../../../context/AuthContext";

export const useJoinList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => joinListByCode(code),
    onSuccess: () => {
      // Sincroniza las listas para que aparezca la nueva lista en "Compartidas conmigo"
      queryClient.invalidateQueries({ queryKey: ["lists", user?.id] });
    },
  });
};