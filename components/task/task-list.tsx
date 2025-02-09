"use client";

import { useCallback, useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { TaskProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";

import api from "@/lib/api";

import TaskFilter from "./task-filter";
import TaskGrid from "./task-grid";

export default function TaskList({ me = false }: { me?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const endpoint = me ? "/tasks/me/" : "/tasks/";

  // URL params state management
  const urlParams = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    assigned_to: searchParams.get("assigned_to") || "",
    sortField: searchParams.get("sortField") || "",
    sortOrder: searchParams.get("sortOrder") || "asc",
  };

  // Local state for search input
  const [searchTerm, setSearchTerm] = useState(urlParams.search);
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // Single function to update any URL parameter
  const updateURLParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Update URL when search changes
  useEffect(() => {
    updateURLParams({ search: debouncedSearch });
  }, [debouncedSearch, updateURLParams]);

  const handleSort = (field: string) => {
    const newOrder = field === urlParams.sortField && urlParams.sortOrder === "asc" ? "desc" : "asc";
    updateURLParams({ sortField: field, sortOrder: newOrder });
  };

  const {
    data: tasks = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tasks", me && "me", urlParams],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        ...urlParams,
        ordering: urlParams.sortOrder === "desc" ? `-${urlParams.sortField}` : urlParams.sortField,
      });
      return api.get<TaskProps[]>(`${endpoint}?${queryParams.toString()}`);
    },
  });

  // if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  return (
    <>
      <TaskFilter
        searchValue={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onFilterChange={updateURLParams}
        filters={urlParams}
      />
      {isLoading && <Loading />}
      <TaskGrid tasks={tasks} sortField={urlParams.sortField} sortOrder={urlParams.sortOrder} onSort={handleSort} />
    </>
  );
}
