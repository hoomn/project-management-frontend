import { useState } from "react";

import Link from "next/link";

import { ProjectProps } from "@/types";

import DateTime from "@/components/ui/date-time";
import Icon from "@/components/ui/icon";
import Menu from "@/components/ui/menu";
import Priority from "@/components/ui/priority";
import Status from "@/components/ui/status";
import UserAvatar from "@/components/ui/user-avatar";
import UserAvatarList from "@/components/ui/user-avatar-list";

import ProjectTaskListSub from "./project-task-list-sub";

export default function ProjectRow({ project }: { project: ProjectProps }) {
  const [showTasks, setShowTasks] = useState(false);

  const menuItems = [
    {
      icon: <Icon icon={"plus-circle"} />,
      name: "new task",
      url: `/projects/${project.id}/tasks/new`,
    },
    {
      icon: <Icon icon={"pencil-square"} />,
      name: "update project",
      url: `/projects/${project.id}/update`,
    },
  ];

  return (
    <>
      <tr
        className={`align-middle${project.status === 1 ? " table-secondary" : ""}${
          project.is_overdue ? " table-danger" : ""
        }`}
      >
        <td>
          <UserAvatar userId={project.created_by} />
        </td>
        <td>
          <Link href={`/projects/${project.id}`} className="fw-medium">
            {project.title}
          </Link>
        </td>
        <td>
          <span className="text-muted">
            <Icon icon="diagram-3" title="number of tasks" />
            <small className="me-2">{project.task_count}</small>
            <Icon icon="chat-dots" title="number of comments" />
            <small className="me-2">{project.comment_count}</small>
            <Icon icon="paperclip" title="number of attachments" />
            <small className="me-2">{project.attachment_count}</small>
          </span>
        </td>
        <td>
          <UserAvatarList userIds={project.assigned_to} />
        </td>
        <td>{project.status !== 1 && <DateTime dateString={project.start_date} />}</td>
        <td>{project.status !== 1 && <DateTime dateString={project.end_date} />}</td>
        <td>
          <Status level={project.status} description={project.status_title} />
        </td>
        <td>{project.status !== 1 && <Priority level={project.priority} description={project.priority_title} />}</td>
        <td>
          <div className="d-flex justify-content-end">
            {project.task_count > 0 && (
              <button className="btn btn-sm" onClick={() => setShowTasks((prevState) => !prevState)}>
                {showTasks ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
              </button>
            )}
            <Menu items={menuItems} />
          </div>
        </td>
      </tr>
      {showTasks && <ProjectTaskListSub projectId={project.id} />}
    </>
  );
}
