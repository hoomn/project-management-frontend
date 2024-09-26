import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useParams, useSearchParams } from "react-router-dom";

import BreadcrumbMenu from "../components/BreadcrumbMenu";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import History from "../components/activity/History";
import AttachmentList from "../components/attachment/AttachmentList";
import CommentList from "../components/comment/CommentList";
import ProjectDetails from "../components/project/ProjectDetails";
import ProjectForm from "../components/project/ProjectForm";
import TaskList from "../components/task/TaskList";

import { fetchProject } from "../api/project";

export default function Project() {
  const authHeader: string = useAuthHeader() || "";

  // Get and convert the string parameter to a number
  const { id } = useParams();
  const projectId = id ? parseInt(id, 10) : 0;

  const [searchParams, setSearchParams] = useSearchParams();

  const view = searchParams.get("view") || "view";

  const {
    isPending,
    isError,
    data: project,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(authHeader, projectId),
  });

  if (isPending) return <Loading />;
  if (isError) throw new Response(error.message);

  const menuItems = [
    {
      name: "new task",
      url: `/projects/${projectId}/tasks/add`,
      icon: <Icon icon={"plus-circle"} />,
    },
    {
      name: "update project",
      url: `/projects/${projectId}?view=update`,
      icon: <Icon icon={"pencil-square"} />,
    },
    {
      name: "delete project",
      url: `/projects/${projectId}/delete`,
      icon: <Icon icon={"trash"} />,
    },
  ];

  function handleViewToggle(view: string) {
    setSearchParams((prev) => {
      prev.set("view", view);
      return prev;
    });
  }

  return (
    <>
      <BreadcrumbMenu title={project.title} items={menuItems} borderColor="burgundy" projectId={project.id} />
      <div className="text-end">
        {view === "view" ? (
          <>
            <button className="btn btn-sm btn-outline-dark me-1" onClick={() => handleViewToggle("update")}>
              <Icon icon={"pencil-square"} />
              update
            </button>
            <History contentType={project.content_type} objectId={project.id} />
          </>
        ) : (
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleViewToggle("view")}>
            <Icon icon="arrow-counterclockwise" />
            never mind
          </button>
        )}
      </div>
      {view === "view" && <ProjectDetails project={project} />}
      {view === "update" && <ProjectForm project={project} />}
      {/* <TaskList projectId={projectId} title={true} /> */}
      <CommentList contentType={project.content_type} objectId={project.id} />
      <AttachmentList contentType={project.content_type} objectId={project.id} />
    </div>
  );
}
