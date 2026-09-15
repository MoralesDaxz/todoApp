// src/features/todos/hooks/useJoinList.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../config/supabase/supabaseClient";

export const useJoinList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const { data, error } = await supabase.rpc("join_list_by_code", {
        p_code: inviteCode.trim().toUpperCase(),
      });

      if (error) throw new Error(error.message);
      return data; // Devuelve { status, list_id, message }
    },
    onSuccess: () => {
      // Fuerza a TanStack Query a obtener las listas actualizadas
      void queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
};
