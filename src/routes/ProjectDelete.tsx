import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Link, useNavigate, useParams } from "react-router-dom";

import Alert from "react-bootstrap/Alert";

import BreadcrumbMenu from "../components/BreadcrumbMenu";
import Icon from "../components/Icon";
import Loading from "../components/Loading";

import { deleteProject, fetchProject } from "../api/project";

export default function ProjectDelete() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authHeader: string = useAuthHeader() || "";

  // Get and convert the string parameter to a number
  const { id } = useParams();
  const projectId = id ? parseInt(id, 10) : 0;

  const {
    isPending,
    isError,
    data: project,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(authHeader, projectId),
  });

  const mutation = useMutation({
    mutationFn: (projectId: number) => deleteProject(authHeader, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/projects");
    },
  });

  const handleDelete = () => {
    mutation.mutate(project.id);
  };

  if (isPending) return <Loading />;
  //@ts-ignore
  if (isError) throw new Response(error.response.data.detail || error.message, { status: error.response?.status });

  const menuItems = [
    {
      name: "all projects",
      url: "/projects",
      icon: <Icon icon={"chevron-left"} />,
    },
  ];

  return (
    <>
      <BreadcrumbMenu title={"Delete Project"} items={menuItems} />
      {mutation.isPending && <Loading />}
      {mutation.isError && (
        <Alert variant="danger" onClose={() => mutation.reset()} dismissible>
          {mutation.error.message}
        </Alert>
      )}
      <div className="mx-auto mt-5" style={{ maxWidth: 600 }}>
        <Alert variant={"danger"}>
          Are you sure you want to delete this project?
          <br />
          <strong>This action cannot be undone!</strong>
        </Alert>
        <div className="text-end">
          <Link className="btn btn-outline-dark me-2" to={`/projects/${project.id}`}>
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
