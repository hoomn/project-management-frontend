"use client";

import { usePathname } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { BorderColor, ProjectProps, SubtaskProps, TaskProps } from "@/types";

import api from "@/lib/api";

import Breadcrumb from "./breadcrumb";
import FetchError from "./fetch-error";
import Menu, { MenuItem } from "./menu";

type PageHeaderProps = {
  title: string;
  items?: MenuItem[];
  borderColor?: BorderColor;
  projectId?: string;
  taskId?: string;
  subtaskId?: string;
};

export default function PageHeader({
  title,
  items = [],
  borderColor = "gray",
  projectId,
  taskId,
  subtaskId,
}: PageHeaderProps) {
  const pathname = usePathname();

  const {
    isPending: isSubtaskPending,
    isError: isSubTtskError,
    data: subtask,
  } = useQuery<SubtaskProps>({
    queryKey: ["subtasks", subtaskId],
    queryFn: () => api.get(`/subtasks/${subtaskId}/`),
    enabled: !!subtaskId,
  });

  const relatedTaskId = taskId || subtask?.task || undefined;

  const {
    isPending: isTaskPending,
    isError: isTaskError,
    data: task,
  } = useQuery<TaskProps>({
    queryKey: ["tasks", relatedTaskId],
    queryFn: () => api.get(`/tasks/${relatedTaskId}/`),
    enabled: !!relatedTaskId,
  });

  const relatedProjectId = projectId || task?.project || undefined;

  const {
    isPending: isProjectPending,
    isError: isProjectError,
    data: project,
  } = useQuery<ProjectProps>({
    queryKey: ["projects", relatedProjectId],
    queryFn: () => api.get(`/projects/${relatedProjectId}/`),
    enabled: !!relatedProjectId,
  });

  if ((subtaskId && isSubtaskPending) || (relatedTaskId && isTaskPending) || (relatedProjectId && isProjectPending))
    return (
      <>
        <p className="placeholder-wave mb-4">
          <span className="placeholder col-2 placeholder-lg mb-1"></span>
          <span className="placeholder col-12 placeholder-xs" style={{ height: "2px" }}></span>
          <span className="placeholder col-1 me-1"></span>
          <span className="placeholder col-1 me-1"></span>
          <span className="placeholder col-1"></span>
        </p>
      </>
    );
  if (isSubTtskError || isTaskError || isProjectError) return <FetchError />;

  const paths = [{ name: "Home", url: "/" }];

  if (pathname === "/projects") paths.push({ name: "Projects", url: "/projects" });
  if (pathname === "/tasks") paths.push({ name: "Tasks", url: "/tasks" });
  if (pathname === "/tasks/me") paths.push({ name: "My Tasks", url: "/tasks/me" });

  if (subtask || task || project) paths.push({ name: "Projects", url: "/projects" });

  if (project) paths.push({ name: project.title, url: `/projects/${project.id}` });
  if (task) paths.push({ name: task.title, url: `/tasks/${task.id}` });
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
