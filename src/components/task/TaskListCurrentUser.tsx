import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useSearchParams } from "react-router-dom";

import { Table } from "react-bootstrap";

import BreadcrumbMenu from "../BreadcrumbMenu";
import FormLabel from "../FormLabel";
import Icon from "../Icon";
import Loading from "../Loading";
import Task from "./Task";
import TaskHeader from "./TaskHeader";

import { fetchTasksCurrentUser } from "../../api/task";
import { fetchUsers } from "../../api/user";

export default function TaskListCurrentUser() {
  const authHeader: string = useAuthHeader() || "";

  const [show, setShow] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const titleFilter = searchParams.get("title") || "";
  const statusFilter = searchParams.get("status") || "";
  const priorityFilter = searchParams.get("priority") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const userIdFilter = searchParams.get("userId") || "";

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["tasks", "current", "user"],
    queryFn: () => fetchTasksCurrentUser(authHeader),
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

  if (isPending || isUsersPending) return <Loading />;

  if (isError || isUsersError)
    //@ts-ignore
    throw new Response(error.response.data.detail || usersError.response.data.detail || error.message);

  // Sort logic
  const sortedData = data.sort((a: TaskProps, b: TaskProps) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "start_date") {
      // Custom sorting for start date
      if (!a.start_date && !b.start_date) return 0; // If both dates are null, leave them in the same order
      if (!a.start_date) return 1; // If a's start date is null, push it to the end
      if (!b.start_date) return -1; // If b's start date is null, push it to the end
      //@ts-ignore
      return new Date(a.start_date) - new Date(b.start_date); // Compare non-null dates
    }
    if (sortBy === "end_date") {
      if (!a.end_date && !b.end_date) return 0;
      if (!a.end_date) return 1;
      if (!b.end_date) return -1;
      //@ts-ignore
      return new Date(a.end_date) - new Date(b.end_date);
    }
    if (sortBy === "priority") return a.priority - b.priority;
    if (sortBy === "priority_r") return b.priority - a.priority;
    if (sortBy === "status") return a.status - b.status;
    if (sortBy === "status_r") return b.status - a.status;
    return 0;
  });

  // Filter logic
  const filteredData = sortedData.filter((task: TaskProps) => {
    return (
      task.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      (userIdFilter === "" || task.assigned_to.includes(parseInt(userIdFilter))) &&
      (statusFilter === "" || task.get_status_display === statusFilter) &&
      (priorityFilter === "" || task.get_priority_display === priorityFilter)
    );
  });

  // Create user ID to name map from user data
  const userIdToNameMap = usersData.reduce((acc: any, user: UserProps) => {
    acc[user.id] = `${user.first_name} ${user.last_name}`;
    return acc;
  }, {});

  // Collect unique values for dropdowns
  const options = data.reduce(
    (acc: any, task: TaskProps) => {
      task.assigned_to.forEach((userId: number) => acc.userId.add(userId));
      task.assigned_to.map((userId: number) => {
        acc.userId.add(userId);
        acc.userName.set(userId, userIdToNameMap[userId]);
      });
      acc.status.add(task.get_status_display);
      acc.priority.add(task.get_priority_display);
      return acc;
    },
    {
      userId: new Set(),
      userName: new Map(),
      status: new Set(),
      priority: new Set(),
    },
  );

  return (
    <>
      <BreadcrumbMenu title={"My Tasks"} />

      {/* Filter components */}
      <div className="row g-3 bg-light pb-3 mt-2 mb-4">
        <div className="col-lg-2 col-md-4">
          <FormLabel label="Title" parent="title" />
          <input
            type="text"
            className="form-control"
            placeholder="Filter by title"
            id="title"
            value={titleFilter}
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("title", e.target.value);
                return prev;
              });
            }}
          />
        </div>

        <div className="col-lg-2 col-md-4">
          <FormLabel label="Assigned to" parent="assigned_to" />
          <select
            className="form-select"
            id="assigned_to"
            value={userIdFilter}
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("userId", e.target.value);
                return prev;
              });
            }}
          >
            <option value="">All</option>
            {[...options.userId].map((userId) => (
              <option key={userId} value={userId}>
                {options.userName.get(userId)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-4">
          <FormLabel label="Status" parent="status" />
          <select
            className="form-select"
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("status", e.target.value);
                return prev;
              });
            }}
          >
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
            id="priority"
            value={priorityFilter}
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("priority", e.target.value);
                return prev;
              });
            }}
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
          <select
            className="form-select"
            id="sort"
            value={sortBy}
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("sortBy", e.target.value);
                return prev;
              });
            }}
          >
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

      <Table responsive="md" striped>
        <TaskHeader />
        <tbody>{filteredData.map((task: TaskProps) => task.status !== 1 && <Task key={task.id} task={task} />)}</tbody>
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
  );
}
