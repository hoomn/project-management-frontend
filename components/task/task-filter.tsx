import { useQuery } from "@tanstack/react-query";

import { OptionProps } from "@/types";

import FormLabel from "@/components/form/form-label";
import Icon from "@/components/ui/icon";

import api from "@/lib/api";

interface Filters {
  search: string;
  status: string;
  priority: string;
  assigned_to: string;
}

type TaskFilterProps = {
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (updates: Partial<Filters>) => void;
  filters: Filters;
};

export default function TaskFilter({ searchValue, onSearchChange, onFilterChange, filters }: TaskFilterProps) {
  const {
    data: userOptions = [],
    isLoading: userIsLoading,
    isError: userIsError,
  } = useQuery<OptionProps[]>({
    queryKey: ["select-options", "user"],
    queryFn: () => api.get("/options/user/"),
  });

  const {
    data: statusOptions = [],
    isLoading: statusIsLoading,
    isError: statusIsError,
  } = useQuery<OptionProps[]>({
    queryKey: ["select-options", "status"],
    queryFn: () => api.get("/options/status/"),
  });

  const {
    data: priorityOptions = [],
    isLoading: priorityIsLoading,
    isError: priorityIsError,
  } = useQuery<OptionProps[]>({
    queryKey: ["select-options", "priority"],
    queryFn: () => api.get("/options/priority/"),
  });

  const handleReset = () => {
    onSearchChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    onFilterChange({
      search: "",
      status: "",
      priority: "",
      assigned_to: "",
    });
  };

  return (
    <div className="row g-3 bg-secondary-subtle pb-3 mt-2 mb-4">
      <div className="col-lg-2 col-md-4">
        <FormLabel label="Search" htmlFor="search" />
        <input
          type="search"
          id="search"
          placeholder="search..."
          value={searchValue}
          onChange={onSearchChange}
          className="form-control"
          autoComplete="off"
        />
      </div>

      <div className="col-lg-2 col-md-4">
        <FormLabel label="Assigned to" htmlFor="assigned_to" />
        <select
          className="form-select"
          id="assigned_to"
          value={filters.assigned_to}
          onChange={(e) => onFilterChange({ assigned_to: e.target.value })}
          disabled={userIsLoading || userIsError}
        >
          <option value="">All</option>
          {userOptions.map((option: OptionProps) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-lg-2 col-md-4">
        <FormLabel label="Status" htmlFor="status" />
        <select
          className="form-select"
          id="status"
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          disabled={statusIsLoading || statusIsError}
        >
          <option value="">All</option>
          {statusOptions.map((option: OptionProps) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-lg-2 col-md-4">
        <FormLabel label="Priority" htmlFor="priority" />
        <select
          className="form-select"
          id="priority"
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          disabled={priorityIsLoading || priorityIsError}
        >
          <option value="">All</option>
          {priorityOptions.map((option: OptionProps) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col d-flex justify-content-end align-items-end">
        <div>
          <button className="btn btn-outline-dark" onClick={handleReset}>
            <Icon icon="arrow-clockwise" me={0} />
          </button>
        </div>
      </div>
    </div>
  );
}
