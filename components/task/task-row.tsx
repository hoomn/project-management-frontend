import { useState } from "react";

import Link from "next/link";

import { TaskProps } from "@/types";

import DateTime from "@/components/ui/date-time";
import Icon from "@/components/ui/icon";
import Menu from "@/components/ui/menu";
import Priority from "@/components/ui/priority";
import Status from "@/components/ui/status";
import UserAvatar from "@/components/ui/user-avatar";
import UserAvatarList from "@/components/ui/user-avatar-list";

import TaskSubtaskListSub from "./task-subtask-list-sub";

export default function TaskRow({ task, submenu = false }: { task: TaskProps; submenu?: boolean }) {
  const [showTasks, setShowTasks] = useState(false);

  const menuItems = [
    {
      icon: <Icon icon={"plus-circle"} />,
      name: "new subtask",
      url: `/tasks/${task.id}/subtasks/new`,
    },
    {
      icon: <Icon icon={"pencil-square"} />,
      name: "update task",
      url: `/tasks/${task.id}/update`,
    },
  ];

  return (
    <>
      <tr
        className={`align-middle${task.status === 1 ? " table-secondary" : ""}${
          task.is_overdue ? " table-danger" : ""
        }`}
      >
        <td>
          <div className="d-flex align-items-center">
            {submenu && (
              <>
                <Icon icon="arrow-return-right" color="text-secondary" />
                <small className="me-2">
                  <span className="badge text-bg-secondary">task</span>
                </small>
              </>
            )}
            <UserAvatar userId={task.created_by} />
          </div>
        </td>
        <td>
          <Link href={`/tasks/${task.id}`} className="fw-medium">
            {task.title}
          </Link>
        </td>
        <td>
          <span className="text-muted">
            <Icon icon="diagram-3" title="number of tasks" />
            <small className="me-2">{task.subtask_count}</small>
            <Icon icon="chat-dots" title="number of comments" />
            <small className="me-2">{task.comment_count}</small>
            <Icon icon="paperclip" title="number of attachments" />
            <small className="me-2">{task.attachment_count}</small>
          </span>
        </td>
        <td>
          <UserAvatarList userIds={task.assigned_to} />
        </td>
        <td>{task.status !== 1 && <DateTime dateString={task.start_date} />}</td>
        <td>{task.status !== 1 && <DateTime dateString={task.end_date} />}</td>
        <td>
          <Status level={task.status} description={task.status_title} />
        </td>
        <td>{task.status !== 1 && <Priority level={task.priority} description={task.priority_title} />}</td>
        <td>
          <div className="d-flex justify-content-end">
            {task.subtask_count > 0 && (
              <button className="btn btn-sm" onClick={() => setShowTasks((prevState) => !prevState)}>
                {showTasks ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
              </button>
            )}
            <Menu items={menuItems} />
          </div>
        </td>
      </tr>
      {showTasks && <TaskSubtaskListSub taskId={task.id} />}
    </>
  );
}
