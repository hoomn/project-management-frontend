import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import DateTime from "../DateTime";
import Icon from "../Icon";
import Menu, { MenuItem } from "../Menu";
import Priority from "../Priority";
import Status from "../Status";
import UserAvatar from "../user/UserAvatar";
import UserAvatarList from "../user/UserAvatarList";
import SubtaskTitle from "./SubtaskTitle";

import { patchSubtask } from "../../api/subtask";

export default function Subtask({ subtask, submenu }: { subtask: SubtaskProps; submenu: boolean }) {
  const authHeader: string = useAuthHeader() || "";
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedSubtask: SubtaskProps) => patchSubtask(authHeader, updatedSubtask),
    onSuccess: () => {
      // match all array keys that starts with subtasks including ["subtasks", "current", "user"] & ["subtasks", subtask.id]
      queryClient.invalidateQueries({ queryKey: ["subtasks"] });
    },
  });

  const handleMarkAsDone = () => {
    const data: any = {
      id: subtask.id,
      status: 1,
    };
    mutation.mutate(data);
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Icon icon={"pencil-square"} />,
      name: "update subtask",
      url: `/subtasks/${subtask.id}?view=update`,
    },
  ];

  if (subtask.status !== 1) {
    menuItems.push({
      icon: <Icon icon={"check2-square"} />,
      name: "mark as done",
      onClick: handleMarkAsDone,
    });
  }

  return (
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
        <SubtaskTitle subtask={subtask} />
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
        <Status level={subtask.status} description={subtask.get_status_display} />
      </td>
      <td>
        {subtask.status !== 1 && <Priority level={subtask.priority} description={subtask.get_priority_display} />}
      </td>
      <td className="text-end">
        <Menu items={menuItems} />
      </td>
    </tr>
  );
}
