import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";

import Loading from "../Loading";
import Task from "./Task";
import TaskHeader from "./TaskHeader";

import { fetchTasks } from "../../api/task";

type TaskListProps = {
  projectId: number;
  title?: boolean;
  header?: boolean;
  submenu?: boolean;
};

export default function TaskList({ projectId, title = false, header = true, submenu = false }: TaskListProps) {
  const authHeader: string = useAuthHeader() || "";

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => fetchTasks(authHeader, projectId),
  });

  if (isPending) return <Loading />;
  if (isError) return <Alert variant={"danger"}>Error: {error.message}</Alert>;

  return (
    <>
      {title && (
        <div className="d-flex align-items-center fw-light text-muted border-bottom border-4 mb-0 border-burgundy pb-2">
          <h5 className="fw-light text-muted me-auto mb-0">Tasks</h5>
          <Link to={`/projects/${projectId}/tasks/add`} className="btn btn-sm btn-outline-success">
            <i className="bi bi-plus-circle me-1"></i>new task
          </Link>
        </div>
      )}
      {data.length === 0 ? (
        <div className="text-center border-top border-bottom bg-light py-2">
          <small className="text-muted fst-italic">no tasks</small>
        </div>
      ) : (
        <Table responsive="md" className="mb-0">
          {header && <TaskHeader />}
          <tbody>
            {data.map((task: TaskProps) => (
              <Task key={task.id} task={task} submenu={submenu} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
