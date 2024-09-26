import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

import Alert from "react-bootstrap/Alert";

import Loading from "../Loading";
import Subtask from "./Subtask";

import { fetchSubtasks } from "../../api/subtask";

export default function SubtaskListSubmenu({ taskId }: { taskId: number }) {
  const authHeader: string = useAuthHeader() || "";

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["subtasks", "task", taskId],
    queryFn: () => fetchSubtasks(authHeader, taskId),
  });

  if (isPending) return <Loading />;
  if (isError) return <Alert variant={"danger"}>Error: {error.message}</Alert>;

  return <>{data?.map((subtask: SubtaskProps) => <Subtask key={subtask.id} subtask={subtask} submenu={true} />)}</>;
}
