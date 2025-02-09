import Link from "next/link";

import { SubtaskProps } from "@/types";

import DateTime from "@/components/ui/date-time";
import Icon from "@/components/ui/icon";
import Menu from "@/components/ui/menu";
import Priority from "@/components/ui/priority";
import Status from "@/components/ui/status";
import UserAvatar from "@/components/ui/user-avatar";
import UserAvatarList from "@/components/ui/user-avatar-list";

export default function SubtasktRow({ subtask, submenu }: { subtask: SubtaskProps; submenu?: boolean }) {
  const menuItems = [
    {
      icon: <Icon icon={"pencil-square"} />,
      name: "update subtask",
      url: `/subtasks/${subtask.id}/update`,
    },
  ];

  return (
    <>
      <tr
        className={`align-middle${subtask.status === 1 ? " table-secondary" : ""}${
          subtask.is_overdue ? " table-danger" : ""
        }`}
      >
        <td>
          <div className="d-flex align-items-center">
            {submenu && (
              <>
                <Icon icon="arrow-return-right" ms={4} color="text-secondary" />
                <small className="me-2">
                  <span className="badge text-bg-secondary">subtask</span>
                </small>
              </>
            )}
            <UserAvatar userId={subtask.created_by} />
          </div>
        </td>
        <td>
          <Link href={`/subtasks/${subtask.id}`} className="fw-medium">
            {subtask.title}
          </Link>
        </td>
        <td>
          <span className="text-muted">
            <Icon icon="chat-dots" title="number of comments" />
            <small className="me-2">{subtask.comment_count}</small>
            <Icon icon="paperclip" title="number of attachments" />
            <small className="me-2">{subtask.attachment_count}</small>
          </span>
        </td>
        <td>
          <UserAvatarList userIds={subtask.assigned_to} />
        </td>
        <td>{subtask.status !== 1 && <DateTime dateString={subtask.start_date} />}</td>
        <td>{subtask.status !== 1 && <DateTime dateString={subtask.end_date} />}</td>
        <td>
          <Status level={subtask.status} description={subtask.status_title} />
        </td>
        <td>{subtask.status !== 1 && <Priority level={subtask.priority} description={subtask.priority_title} />}</td>
        <td>
          <div className="d-flex justify-content-end">
            <Menu items={menuItems} />
          </div>
        </td>
      </tr>
    </>
  );
}
