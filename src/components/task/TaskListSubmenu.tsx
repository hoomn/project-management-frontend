import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import Alert from "react-bootstrap/Alert";

import Loading from "../Loading";
import Task from "./Task";

import { fetchTasks } from "../../api/task";

export default function TaskListSubmenu({ projectId }: { projectId: number }) {
  const authHeader: string = useAuthHeader() || "";

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => fetchTasks(authHeader, projectId),
  });

  if (isPending) return <Loading />;
  if (isError) return <Alert variant={"danger"}>Error: {error.message}</Alert>;

  return (
    <>
      {data.map((task: TaskProps) => (
        <Task key={task.id} task={task} submenu={true} />
      ))}
    </>
  );
}
