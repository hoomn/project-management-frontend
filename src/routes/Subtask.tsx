import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useParams, useSearchParams } from "react-router-dom";

import BreadcrumbMenu from "../components/BreadcrumbMenu";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import History from "../components/activity/History";
import AttachmentList from "../components/attachment/AttachmentList";
import CommentList from "../components/comment/CommentList";
import SubtaskDetails from "../components/subtask/SubtaskDetails";
import SubtaskForm from "../components/subtask/SubtaskForm";

import { fetchSubtask } from "../api/subtask";

export default function Subtask() {
  const authHeader: string = useAuthHeader() || "";

  // Get and convert the string parameter to a number
  const { id } = useParams();
  const subtaskId = id ? parseInt(id, 10) : 0;

  const [searchParams, setSearchParams] = useSearchParams({ view: "view" });

  const view = searchParams.get("view") || "view";

  const {
    isPending,
    isError,
    data: subtask,
    error,
  } = useQuery({
    queryKey: ["subtask", subtaskId],
    queryFn: () => fetchSubtask(authHeader, subtaskId),
  });

  if (isPending) return <Loading />;
  //@ts-ignore
  if (isError)
    throw new Response(error.response.data.detail || error.message, {
      status: error.response?.status,
    });

  function handleViewToggle(view: string) {
    setSearchParams((prev) => {
      prev.set("view", view);
      return prev;
    });
  }

  const menuItems = [
    {
      name: "update subtask",
      url: `/subtasks/${subtask.id}?view=update`,
      icon: <Icon icon={"pencil-square"} />,
    },
    {
      name: "delete",
      url: `/subtasks/${subtask.id}/delete`,
      icon: <Icon icon={"trash3"} />,
    },
    {
      name: "all subtasks",
      url: `/tasks/${subtask.task}`,
      icon: <Icon icon={"chevron-left"} />,
    },
  ];

  return (
    <div>
      <BreadcrumbMenu title="Subtask" subtaskId={subtaskId} items={menuItems} borderColor="cyan" />
      <div className="text-end">
        {view === "view" ? (
          <>
            <button className="btn btn-sm btn-outline-dark me-1" onClick={() => handleViewToggle("update")}>
              <Icon icon={"pencil-square"} />
              update
            </button>
            <History contentType={subtask.content_type} objectId={subtask.id} />
          </>
        ) : (
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleViewToggle("view")}>
            <Icon icon="arrow-counterclockwise" />
            never mind
          </button>
        )}
      </div>
      {view === "view" && <SubtaskDetails subtask={subtask} />}
      {view === "update" && <SubtaskForm subtask={subtask} />}
      <CommentList contentType={subtask.content_type} objectId={subtask.id} borderColor="cyan" />
      <AttachmentList contentType={subtask.content_type} objectId={subtask.id} borderColor="cyan" />
    </div>
  );
}
