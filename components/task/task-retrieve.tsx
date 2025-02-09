"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { TaskProps } from "@/types";

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

import TaskSubtaskList from "./task-subtask-list";

export default function TaskRetrieve({ id }: { id: string }) {
  const {
    data: task,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => api.get<TaskProps>(`/tasks/${id}`),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  const menuItems = [
    {
      name: "new subtask",
      url: `/tasks/${id}/subtasks/new`,
      icon: <Icon icon={"plus-circle"} />,
    },
    {
      name: "update task",
      url: `/tasks/${id}/update`,
      icon: <Icon icon={"pencil-square"} />,
    },
    {
      name: "delete task",
      url: `/tasks/${id}/delete`,
      icon: <Icon icon={"trash"} />,
    },
  ];

  return (
    <>
      {task && (
        <>
          <PageHeader title={task.title} items={menuItems} taskId={id} borderColor="navy" />
          <div className="text-end">
            <Link href={`/tasks/${task.id}/update`} className="btn btn-sm btn-outline-dark me-1">
              update
            </Link>
            <History contentType={task.content_type} objectId={task.id} />
          </div>
          <div className="row">
            <div className="col-md-12">
              <p className="text-muted fst-italic fw-light mb-0">Title:</p>
              <div className="mb-4">{task.title}</div>
            </div>
            <div className="col-md-12 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Description:</p>
              <Description content={task.description} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Start Date:</p>
              <DateTime dateString={task.start_date} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">End Date:</p>
              <DateTime dateString={task.end_date} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Status:</p>
              <Status level={task.status} description={task.status_title} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Priority:</p>
              <Priority level={task.priority} description={task.priority_title} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-1 me-1">Assigned to:</p>
              <UserAvatarList userIds={task.assigned_to} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-1 me-1">Owner:</p>
              <UserAvatarList userIds={task.created_by ? [task.created_by] : []} />
            </div>
            <div className="d-flex fst-italic fw-light text-muted py-2">
              <small className="me-auto">Created {task.time_since_creation}</small>
              <small>Last modified {task.time_since_update}</small>
            </div>
          </div>
          <SectionHeader title="Subtasks" borderColor="navy" />
          <TaskSubtaskList taskId={id} />
          <CommentList contentType={task.content_type} objectId={task.id} borderColor="navy" />
          <AttachmentList contentType={task.content_type} objectId={task.id} borderColor="navy" />
        </>
      )}
    </>
  );
}
