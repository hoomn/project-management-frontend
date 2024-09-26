import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Link, useNavigate, useParams } from "react-router-dom";

import Alert from "react-bootstrap/Alert";

import BreadcrumbMenu from "../components/BreadcrumbMenu";
import Loading from "../components/Loading";

import { deleteSubtask, fetchSubtask } from "../api/subtask";

export default function SubtaskDelete() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authHeader: string = useAuthHeader() || "";

  // Get and convert the string parameter to a number
  const { id } = useParams();
  const subtaskId = id ? parseInt(id, 10) : 0;

  const {
    isPending,
    isError,
    data: subtask,
    error,
  } = useQuery({
    queryKey: ["subtask", subtaskId],
    queryFn: () => fetchSubtask(authHeader, subtaskId),
  });

  const mutation = useMutation({
    mutationFn: (subtaskId: number) => deleteSubtask(authHeader, subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subtasks", "task", subtask.task],
      });
      navigate(`/tasks/${subtask.task}`);
    },
  });

  const handleDelete = () => {
    mutation.mutate(subtask.id);
  };

  if (isPending) return <Loading />;
  //@ts-ignore
  if (isError) throw new Response(error.response.data.detail || error.message, { status: error.response?.status });

  return (
    <>
      <BreadcrumbMenu title={"Delete Subtask"} />
      {mutation.isPending && <Loading />}
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
      <div className="mx-auto mt-5" style={{ maxWidth: 600 }}>
        <Alert variant={"danger"}>
          Are you sure you want to delete this subtask?
          <br />
          <strong>This action cannot be undone!</strong>
        </Alert>
        <div className="text-end">
          <Link className="btn btn-outline-success me-2" to={`/subtasks/${subtask.id}`}>
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
