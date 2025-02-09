"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { ProjectProps } from "@/types";

import History from "@/components/activity/history";
import AttachmentList from "@/components/attachment/attachment-list";
import CommentList from "@/components/comment/comment-list";
import DateTime from "@/components/ui/date-time";
import Description from "@/components/ui/description";
import FetchError from "@/components/ui/fetch-error";
import Icon from "@/components/ui/icon";
import Loading from "@/components/ui/loading";
import PageHeader from "@/components/ui/page-header";
import Priority from "@/components/ui/priority";
import SectionHeader from "@/components/ui/section-header";
import Status from "@/components/ui/status";
import UserAvatarList from "@/components/ui/user-avatar-list";

import api from "@/lib/api";

import ProjectTaskList from "./project-task-list";

export default function ProjectRetrieve({ id }: { id: string }) {
  const {
    data: project,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get<ProjectProps>(`/projects/${id}`),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  const menuItems = [
    {
      name: "new task",
      url: `/projects/${id}/tasks/new/`,
      icon: <Icon icon={"plus-circle"} />,
    },
    {
      name: "update project",
      url: `/projects/${id}/update`,
      icon: <Icon icon={"pencil-square"} />,
    },
    {
      name: "delete project",
      url: `/projects/${id}/delete`,
      icon: <Icon icon={"trash"} />,
    },
  ];

  return (
    <>
      {project && (
        <>
          <PageHeader title={project.title} items={menuItems} projectId={id} borderColor="burgundy" />
          <div className="text-end">
            <Link href={`/projects/${project.id}/update`} className="btn btn-sm btn-outline-dark me-1">
              update
            </Link>
            <History contentType={project.content_type} objectId={project.id} />
          </div>
          <div className="row">
            <div className="col-md-6">
              <p className="text-muted fst-italic fw-light mb-0">Title:</p>
              <div className="mb-4">{project.title}</div>
            </div>
            <div className="col-md-6">
              <p className="text-muted fst-italic fw-light mb-0">Domain:</p>
              <div className="mb-4">{project.domain_title}</div>
            </div>
            <div className="col-md-12 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Description:</p>
              <Description content={project.description} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Start Date:</p>
              <DateTime dateString={project.start_date} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">End Date:</p>
              <DateTime dateString={project.end_date} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Status:</p>
              <Status level={project.status} description={project.status_title} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Priority:</p>
              <Priority level={project.priority} description={project.priority_title} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-1 me-1">Assigned to:</p>
              <UserAvatarList userIds={project.assigned_to} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-1 me-1">Owner:</p>
              <UserAvatarList userIds={project.created_by ? [project.created_by] : []} />
            </div>
            <div className="d-flex fst-italic fw-light text-muted py-2">
              <small className="me-auto">Created {project.time_since_creation}</small>
              <small>Last modified {project.time_since_update}</small>
            </div>
          </div>
          <SectionHeader title="Tasks" borderColor="burgundy" />
          <ProjectTaskList projectId={id} />
          <CommentList contentType={project.content_type} objectId={project.id} borderColor="burgundy" />
          <AttachmentList contentType={project.content_type} objectId={project.id} borderColor="burgundy" />
        </>
      )}
    </>
  );
}
