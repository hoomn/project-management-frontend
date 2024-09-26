import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useSearchParams } from "react-router-dom";

import { Table } from "react-bootstrap";

import BreadcrumbMenu from "../BreadcrumbMenu";
import FormLabel from "../FormLabel";
import Icon from "../Icon";
import Loading from "../Loading";
import Task from "../task/Task";
import TaskHeader from "./TaskHeader";

import { fetchTasksCurrentUserDomain } from "../../api/task";
import { fetchUsers } from "../../api/user";

export default function TaskListCurrentDomain() {
  const authHeader: string = useAuthHeader() || "";

  const [show, setShow] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const titleFilter = searchParams.get("title") || "";
  const statusFilter = searchParams.get("status") || "";
  const priorityFilter = searchParams.get("priority") || "";
  const sort = searchParams.get("sort") || "";
  const assignedTo = searchParams.get("assigned_to") || "";

  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["tasks", "current", "domain"],
    queryFn: () => fetchTasksCurrentUserDomain(authHeader, assignedTo),
    initialData: [],
  });

  const {
    isPending: isUsersPending,
    isError: isUsersError,
    data: usersData,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(authHeader),
    enabled: !isPending,
  });

  // Collect unique values for dropdowns
  // Memoize options calculation to improve performance
  const options = useMemo(() => {
    return data.reduce(
      (acc: any, task: TaskProps) => {
        acc.status.add(task.get_status_display);
        acc.priority.add(task.get_priority_display);
        return acc;
      },
      { status: new Set(), priority: new Set() },
    );
  }, [data]); // Recompute only when `data` changes

  useEffect(() => {
    refetch();
    setIsFiltering(false);
  }, [assignedTo]);

  useEffect(() => {
    setIsFiltering(false);
  }, [data, sort, titleFilter, statusFilter, priorityFilter]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setIsFiltering(true);
    const { name, value } = e.target;
    setSearchParams(
      (prev) => {
        prev.set(name, value);
        return prev;
      },
      { replace: true },
    );
  };

  if (isPending || isUsersPending) return <Loading />;
  if (isError || isUsersError)
    //@ts-ignore
    throw new Response(error.response.data.detail || usersError.response.data.detail || error.message);

  // Sort logic
  const sortedData = data.sort((a: TaskProps, b: TaskProps) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "start_date") {
      // Custom sorting for start date
      if (!a.start_date && !b.start_date) return 0; // If both dates are null, leave them in the same order
      if (!a.start_date) return 1; // If a's start date is null, push it to the end
      if (!b.start_date) return -1; // If b's start date is null, push it to the end
      //@ts-ignore
      return new Date(a.start_date) - new Date(b.start_date); // Compare non-null dates
    }
    if (sort === "end_date") {
      if (!a.end_date && !b.end_date) return 0;
      if (!a.end_date) return 1;
      if (!b.end_date) return -1;
      //@ts-ignore
      return new Date(a.end_date) - new Date(b.end_date);
    }
    if (sort === "priority") return a.priority - b.priority;
    if (sort === "priority_r") return b.priority - a.priority;
    if (sort === "status") return a.status - b.status;
    if (sort === "status_r") return b.status - a.status;
    return 0;
  });

  // Filter logic
  const filteredData = sortedData.filter((task: TaskProps) => {
    return (
      task.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      (statusFilter === "" || task.get_status_display === statusFilter) &&
      (priorityFilter === "" || task.get_priority_display === priorityFilter)
    );
  });

  return (
    <>
      <BreadcrumbMenu title={"Tasks"} />

      {/* Filter components */}
      <div className="row g-3 bg-light pb-3 mt-2 mb-4">
        <div className="col-lg-2 col-md-4">
          <FormLabel label="Title" parent="title" />
          <input
            type="text"
            className="form-control"
            placeholder="Filter by title"
            name="title"
            id="title"
            value={titleFilter}
            onChange={handleFilterChange}
          />
        </div>

        <div className="col-lg-2 col-md-4">
          <FormLabel label="Assigned to" parent="assigned_to" />
          <select
            className="form-select"
            name="assigned_to"
            id="assigned_to"
            value={assignedTo}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            {usersData.map((user: UserProps) => (
              <option key={user.id} value={user.id}>
                {`${user.first_name} ${user.last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-4">
          <FormLabel label="Status" parent="status" />
          <select className="form-select" name="status" id="status" value={statusFilter} onChange={handleFilterChange}>
            <option value="">All</option>
            {[...options.status].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-4">
          <FormLabel label="Priority" parent="priority" />
          <select
            className="form-select"
            name="priority"
            id="priority"
            value={priorityFilter}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            {[...options.priority].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-4">
          <FormLabel label="Sort by" parent="sort" />
          <select className="form-select" name="sort" id="sort" value={sort} onChange={handleFilterChange}>
            <option value="">-</option>
            <option value="title">Title</option>
            <option value="start_date">Start Date</option>
            <option value="end_date">End Date</option>
            <option value="status">Status</option>
            <option value="status_r">Status Reverse</option>
            <option value="priority">Priority Low to High</option>
            <option value="priority_r">Priority High to Low</option>
          </select>
        </div>

        <div className="col d-flex justify-content-end align-items-end">
          <div>
            <button className="btn btn-outline-dark" onClick={() => setSearchParams({})}>
              <Icon icon="arrow-clockwise" me={0} />
            </button>
          </div>
        </div>
      </div>
      {/* /Filter components */}

      {isFiltering ? (
        <Loading />
      ) : (
        <>
          <Table responsive="md" striped>
            <TaskHeader />
            <tbody>
              {filteredData.map((task: TaskProps) => task.status !== 1 && <Task key={task.id} task={task} />)}
            </tbody>
          </Table>

          {filteredData.some((task: TaskProps) => task.status === 1) && (
            <div className="text-center mb-4">
              <button className="btn btn-sm btn-link" onClick={() => setShow((prev) => !prev)}>
                {show ? "hide done tasks" : "show done tasks"}
              </button>
            </div>
          )}

          {show && (
            <Table responsive="md" striped>
              <tbody>
                {filteredData.map((task: TaskProps) => task.status === 1 && <Task key={task.id} task={task} />)}
              </tbody>
            </Table>
          )}
        </>
      )}
    </>
  );
}
