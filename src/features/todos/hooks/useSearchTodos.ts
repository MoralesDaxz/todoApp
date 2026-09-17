// src/features/todos/hooks/useSearchTodos.ts
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchGlobalTodos } from "../api/searchService";
import { useAuth } from "../../../context/AuthContext";

export const useSearchTodos = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Retardo de 300ms para evitar spam a la BD
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["globalSearchTodos", debouncedQuery],
    queryFn: () => searchGlobalTodos(debouncedQuery),
    enabled: Boolean(user?.id) && debouncedQuery.length >= 3,
    staleTime: 1000 * 60 * 1, // 1 minuto de caché por término
  });

  return {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
  };
};