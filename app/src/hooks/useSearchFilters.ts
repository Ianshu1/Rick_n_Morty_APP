import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

export const useSearchFilters = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentPath = window.location.pathname;

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      name: params.get("name") || "",
      status: params.get("status") || "",
      gender: params.get("gender") || "",
      location: params.get("location") || "",
      page: params.get("page") || "",
    };
  });

  const [isOpen, setIsOpen] = useState(false);
  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const updateSearch = async () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, value]) => value !== "")
      );

      const newSearch = {
        name: cleanedFilters.name || undefined,
        status: cleanedFilters.status || undefined,
        gender: cleanedFilters.gender || undefined,
        location: cleanedFilters.location || undefined,
        page: cleanedFilters.page ? parseInt(cleanedFilters.page) : undefined,
      };

      await navigate({
        to: currentPath as "/" | "/favorites",
        search: newSearch,
        replace: true,
      });

      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "characters" ||
          query.queryKey[0] === "favoriteCharacters",
      });
    };

    updateSearch();
  }, [debouncedFilters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: "" }));
  };

  const handleClear = () => {
    setFilters({ name: "", status: "", gender: "", location: "", page: "" });
    setIsOpen(false);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== ""
  ).length;

  return {
    filters,
    isOpen,
    setIsOpen,
    handleFilterChange,
    handleClear,
    activeFiltersCount,
  };
};
