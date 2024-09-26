import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import { Alert } from "react-bootstrap";

import Breadcrumb from "./Breadcrumb";
import Loading from "./Loading";
import { MenuItem } from "./Menu";
import Menu from "./Menu";

import { fetchProject } from "../api/project";
import { fetchSubtask } from "../api/subtask";
import { fetchTask } from "../api/task";

type BreadcrumbMenuProps = {
  title: string;
  items?: MenuItem[];
  borderColor?: "gray" | "burgundy" | "navy" | "cyan";
  projectId?: number | undefined;
  taskId?: number | undefined;
  subtaskId?: number | undefined;
};

export default function BreadcrumbMenu({
  title,
  items = [],
  borderColor = "gray",
  projectId = undefined,
  taskId = undefined,
  subtaskId = undefined,
}: BreadcrumbMenuProps) {
  const authHeader: string = useAuthHeader() || "";

  const {
    isPending: isSubtaskPending,
    isError: isSubTtskError,
    data: subtask,
  } = useQuery({
    queryKey: ["subtask", subtaskId],
    queryFn: () => fetchSubtask(authHeader, subtaskId),
    enabled: !!subtaskId,
  });

  const relatedTaskId = taskId || subtask?.task || undefined;

  const {
    isPending: isTaskPending,
    isError: isTaskError,
    data: task,
  } = useQuery({
    queryKey: ["task", relatedTaskId],
    queryFn: () => fetchTask(authHeader, relatedTaskId),
    enabled: !!relatedTaskId,
  });

  const relatedProjectId = projectId || task?.project || undefined;

  const {
    isPending: isProjectPending,
    isError: isProjectError,
    data: project,
  } = useQuery({
    queryKey: ["project", relatedProjectId],
    queryFn: () => fetchProject(authHeader, relatedProjectId),
    enabled: !!relatedProjectId,
  });

  if ((subtaskId && isSubtaskPending) || (relatedTaskId && isTaskPending) || (relatedProjectId && isProjectPending))
    return <Loading />;
  if (isSubTtskError || isTaskError || isProjectError) return <Alert variant={"danger"}>Error fetching</Alert>;

  let paths = [{ name: "Home", url: "/" }];
  if (subtask || task || project) {
    paths.push({ name: "Projects", url: "/projects" });
  }

  if (project) paths.push({ name: project.title, url: `/projects/${project.id}` });
  if (relatedTaskId) paths.push({ name: task.title, url: `/tasks/${task.id}` });
  if (subtask) paths.push({ name: subtask.title, url: `/subtasks/${subtask.id}` });

  return (
    <>
      <div className={`d-flex border-bottom border-4 mb-1 mt-5 mb-1 border-${borderColor}`}>
        <h1 className="h2 fw-light me-auto">{title}</h1>
      </div>
      <div className="d-flex">
        <div className="flex-grow-1">
          {items.length > 0 ? <Breadcrumb paths={paths} /> : <div className="my-3 py-3"></div>}
        </div>
        <div>{items.length !== 0 && <Menu items={items} />}</div>
      </div>
    </>
  );
}
