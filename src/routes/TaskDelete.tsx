import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Link, useNavigate, useParams } from "react-router-dom";

import Alert from "react-bootstrap/Alert";

import BreadcrumbMenu from "../components/BreadcrumbMenu";
import Icon from "../components/Icon";
import Loading from "../components/Loading";

import { deleteTask, fetchTask } from "../api/task";

export default function TaskDelete() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authHeader: string = useAuthHeader() || "";

  // Get and convert the string parameter to a number
  const { id } = useParams();
  const taskId = id ? parseInt(id, 10) : 0;

  const {
    isPending,
    isError,
    data: task,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(authHeader, taskId),
  });

  const mutation = useMutation({
    mutationFn: (taskId: number) => deleteTask(authHeader, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "project", task.project],
      });
      navigate(`/projects/${task.project}`);
    },
  });

  const handleDelete = () => {
    mutation.mutate(task.id);
  };

  if (isPending) return <Loading />;
  //@ts-ignore
  if (isError)
    throw new Response(error.response.data.detail || error.message, {
      status: error.response?.status,
    });

  const menuItems = [
    {
      name: "all tasks",
      url: `/projects/${task.project}/`,
      icon: <Icon icon={"chevron-left"} />,
    },
  ];

  return (
    <>
      <BreadcrumbMenu title={"Delete Task"} items={menuItems} />
      {mutation.isPending && <Loading />}
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
      <div className="mx-auto mt-5" style={{ maxWidth: 600 }}>
        <Alert variant={"danger"}>
          Are you sure you want to delete this task?
          <br />
          <strong>This action cannot be undone!</strong>
        </Alert>
        <div className="text-end">
          <Link className="btn btn-outline-success me-2" to={`/tasks/${task.id}`}>
            never mind
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            delete
          </button>
        </div>
      </div>
    </>
  );
}
