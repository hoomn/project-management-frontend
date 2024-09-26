import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import DateTime from "../DateTime";
import Icon from "../Icon";
import Menu, { MenuItem } from "../Menu";
import Priority from "../Priority";
import Status from "../Status";
import SubtaskListSubmenu from "../subtask/SubtaskListSubmenu";
import UserAvatar from "../user/UserAvatar";
import UserAvatarList from "../user/UserAvatarList";
import TaskTitle from "./TaskTitle";

import { patchTask } from "../../api/task";

export default function Task({ task, submenu = false }: { task: TaskProps; submenu?: boolean }) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const authHeader: string = useAuthHeader() || "";
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedTask: TaskProps) => patchTask(authHeader, updatedTask),
    onSuccess: () => {
      // match all array keys that starts with tasks including ["tasks", "current", "user"] & ["tasks", task.id]
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleMarkAsDone = () => {
    const data: any = {
      id: task.id,
      status: 1,
    };
    mutation.mutate(data);
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Icon icon={"plus-circle"} />,
      name: "new subtask",
      url: `/tasks/${task.id}/subtasks/add`,
    },
    {
      icon: <Icon icon={"pencil-square"} />,
      name: "update task",
      url: `/tasks/${task.id}?view=update`,
    },
  ];

  if (task.status !== 1) {
    menuItems.push({
      icon: <Icon icon={"check2-square"} />,
      name: "mark as done",
      onClick: handleMarkAsDone,
    });
  }

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
          <TaskTitle title={task.title} taskId={task.id} projectId={task.project} />
        </td>
        <td>
          <span className="text-muted">
            <Icon icon="diagram-3" title="number of subtasks" />
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
          <Status level={task.status} description={task.get_status_display} />
        </td>
        <td>{task.status !== 1 && <Priority level={task.priority} description={task.get_priority_display} />}</td>
        <td>
          <div className="d-flex justify-content-end">
            {task.subtask_count > 0 && (
              <button className="btn btn-sm" onClick={() => setShowSubtasks((prevState) => !prevState)}>
                {showSubtasks ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
              </button>
            )}
            <Menu items={menuItems} />
          </div>
        </td>
      </tr>
      {showSubtasks && <SubtaskListSubmenu taskId={task.id} />}
    </>
  );
}
