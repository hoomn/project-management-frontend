import { useState } from "react";
import { Link } from "react-router-dom";

import DateTime from "../DateTime";
import Icon from "../Icon";
import Menu from "../Menu";
import Priority from "../Priority";
import Status from "../Status";
import TaskListSubmenu from "../task/TaskListSubmenu";
import UserAvatar from "../user/UserAvatar";
import UserAvatarList from "../user/UserAvatarList";

export default function Project({ project }: { project: ProjectProps }) {
  const [showTasks, setShowTasks] = useState(false);

  const menuItems = [
    {
      icon: <Icon icon={"plus-circle"} />,
      name: "new task",
      url: `/projects/${project.id}/tasks/add`,
    },
    {
      icon: <Icon icon={"pencil-square"} />,
      name: "update project",
      url: `/projects/${project.id}?view=update`,
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
          <Link to={`/projects/${project.id}`} className="fw-medium">
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
          <Status level={project.status} description={project.get_status_display} />
        </td>
        <td>
          {project.status !== 1 && <Priority level={project.priority} description={project.get_priority_display} />}
        </td>
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
      {showTasks && <TaskListSubmenu projectId={project.id} />}
    </>
  );
}
