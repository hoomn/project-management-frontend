"use client";

import { useCallback, useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { ProjectProps } from "@/types";

import FetchError from "@/components/ui/fetch-error";
import Loading from "@/components/ui/loading";

import api from "@/lib/api";

import ProjectFilter from "./project-filter";
import ProjectGrid from "./project-grid";

export default function ProjectList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const updateURL = useCallback(
    (newParams: { [key: string]: string }) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
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

  // Effect to update URL when debounced search changes
  useEffect(() => {
    updateURL({ search: debouncedSearch });
  }, [debouncedSearch, updateURL]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = useCallback(
    (field: string) => {
      const newOrder = field === sortField && sortOrder === "asc" ? "desc" : "asc";
      updateURL({ sortField: field, sortOrder: newOrder });
    },
    [sortField, sortOrder, updateURL],
  );

  const {
    data: projects = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["projects", debouncedSearch, sortField, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: debouncedSearch || "",
        ordering: sortOrder === "desc" ? `-${sortField}` : sortField,
      });

      return api.get<ProjectProps[]>(`/projects/?${params.toString()}`);
    },
  });

  if (error) return <FetchError message={error.message} />;

  return (
    <>
      <ProjectFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearchChange={handleSearchChange} />
      {isLoading && <Loading />}
      <ProjectGrid projects={projects} sortField={sortField} sortOrder={sortOrder} onSort={handleSort} />
    </>
  );
}
