// features/todos/hooks/useLists.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyLists, createList } from "../api/listService";
import { useAuth } from "../../../context/AuthContext";

export const useLists = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: lists = [], isLoading } = useQuery({
    queryKey: ['lists', user?.id],
    queryFn: () => getMyLists(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createList(name, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lists', user?.id] }),
  });

  return { lists, isLoading, createMutation };
};

/* import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createList, getMyLists } from "../api/listService";

export const useLists = () => {
  const queryClient = useQueryClient();

  // Query: Centraliza el fetching
  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: getMyLists,
  });

  // Mutation: Centraliza la inserción y la invalidación automática
  const createListMutation = useMutation({
    mutationFn: createList, // tu función que inserta en la DB
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });

  return { lists, isLoading, createListMutation };
}; */