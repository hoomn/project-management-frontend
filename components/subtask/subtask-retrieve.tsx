"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { SubtaskProps } from "@/types";

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
import Status from "@/components/ui/status";
import UserAvatarList from "@/components/ui/user-avatar-list";

import api from "@/lib/api";

export default function TaskRetrieve({ id }: { id: string }) {
  const {
    data: subtask,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["subtasks", id],
    queryFn: () => api.get<SubtaskProps>(`/subtasks/${id}`),
  });

  if (isLoading) return <Loading />;
  if (error) return <FetchError message={error.message} />;

  const menuItems = [
    {
      name: "update subtask",
      url: `/subtasks/${id}/update`,
      icon: <Icon icon={"pencil-square"} />,
    },
    {
      name: "delete subtask",
      url: `/subtasks/${id}/delete`,
      icon: <Icon icon={"trash"} />,
    },
  ];

  return (
    <>
      {subtask && (
        <>
          <PageHeader title={subtask.title} items={menuItems} subtaskId={id} borderColor="cyan" />
          <div className="text-end">
            <Link href={`/subtasks/${subtask.id}/update`} className="btn btn-outline-secondary me-1">
              <Icon icon="pencil-square" />
              update
            </Link>
            <History contentType={subtask.content_type} objectId={subtask.id} />
          </div>
          <div className="row">
            <div className="col-md-12">
              <p className="text-muted fst-italic fw-light mb-0">Title:</p>
              <div className="mb-4">{subtask.title}</div>
            </div>
            <div className="col-md-12 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Description:</p>
              <Description content={subtask.description} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Start Date:</p>
              <DateTime dateString={subtask.start_date} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">End Date:</p>
              <DateTime dateString={subtask.end_date} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Status:</p>
              <Status level={subtask.status} description={subtask.status_title} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-0">Priority:</p>
              <Priority level={subtask.priority} description={subtask.priority_title} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-1 me-1">Assigned to:</p>
              <UserAvatarList userIds={subtask.assigned_to} />
            </div>
            <div className="col-md-6 mb-4">
              <p className="text-muted fst-italic fw-light mb-1 me-1">Owner:</p>
              <UserAvatarList userIds={subtask.created_by ? [subtask.created_by] : []} />
            </div>
            <div className="d-flex fst-italic fw-light text-muted py-2">
              <small className="me-auto">Created {subtask.time_since_creation}</small>
              <small>Last modified {subtask.time_since_update}</small>
            </div>
          </div>
          <CommentList contentType={subtask.content_type} objectId={subtask.id} borderColor="cyan" />
          <AttachmentList contentType={subtask.content_type} objectId={subtask.id} borderColor="cyan" />
        </>
      )}
    </>
  );
}
