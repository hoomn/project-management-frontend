import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useParams, useSearchParams } from "react-router-dom";

import BreadcrumbMenu from "../components/BreadcrumbMenu";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import History from "../components/activity/History";
import AttachmentList from "../components/attachment/AttachmentList";
import CommentList from "../components/comment/CommentList";
import SubtaskList from "../components/subtask/SubtaskList";
import TaskDetails from "../components/task/TaskDetails";
import TaskForm from "../components/task/TaskForm";

import { fetchTask } from "../api/task";

export default function Task() {
  const authHeader: string = useAuthHeader() || "";

  const { id } = useParams();

  // Convert the string parameter to a number
  const taskId = id ? parseInt(id, 10) : 0;

  const [searchParams, setSearchParams] = useSearchParams({ view: "view" });
  const view = searchParams.get("view") || "view";

  const {
    isPending,
    isError,
    data: task,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(authHeader, taskId),
  });

  if (isPending) return <Loading />;
  if (isError) throw new Response(error.message);

  function handleViewToggle(view: string) {
    setSearchParams((prev) => {
      prev.set("view", view);
      return prev;
    });
  }

  const menuItems = [
    {
      name: "new subtask",
      url: `/tasks/${task.id}/subtasks/add`,
      icon: <Icon icon={"plus-circle"} />,
    },
    {
      name: "update task",
      url: `/tasks/${task.id}?view=update`,
      icon: <Icon icon={"pencil-square"} />,
    },
    {
      name: "delete task",
      url: `/tasks/${task.id}/delete`,
      icon: <Icon icon={"trash3"} />,
    },
    {
      name: "all tasks",
      url: `/projects/${task.project}`,
      icon: <Icon icon={"chevron-left"} />,
    },
  ];

  return (
    <div>
      <BreadcrumbMenu title={task.title} items={menuItems} borderColor="navy" taskId={task.id} />
      <div className="text-end">
        {view === "view" ? (
          <>
            <button className="btn btn-sm btn-outline-dark me-1" onClick={() => handleViewToggle("update")}>
              <Icon icon={"pencil-square"} />
              update
            </button>
            <History contentType={task.content_type} objectId={task.id} />
          </>
        ) : (
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleViewToggle("view")}>
            <Icon icon="arrow-counterclockwise" />
            never mind
          </button>
        )}
      </div>
      {view === "view" && <TaskDetails task={task} />}
      {view === "update" && <TaskForm task={task} />}
      <SubtaskList taskId={taskId} title={true} />
      <CommentList contentType={task.content_type} objectId={task.id} borderColor="navy" />
      <AttachmentList contentType={task.content_type} objectId={task.id} borderColor="navy" />
    </div>
  );
}
