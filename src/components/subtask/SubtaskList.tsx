import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";

import Loading from "../Loading";
import Subtask from "./Subtask";
import SubaskHeader from "./SubtaskHeader";

import { fetchSubtasks } from "../../api/subtask";

type SubtaskListProps = {
  taskId: number;
  title?: boolean;
  header?: boolean;
  submenu?: boolean;
};

export default function SubtaskList({ taskId, title = false, header = true, submenu = false }: SubtaskListProps) {
  const authHeader: string = useAuthHeader() || "";

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["subtasks", "task", taskId],
    queryFn: () => fetchSubtasks(authHeader, taskId),
  });

  if (isPending) return <Loading />;
  if (isError) return <Alert variant={"danger"}>Error: {error.message}</Alert>;

  return (
    <>
      {title && (
        <div className="d-flex align-items-center fw-light text-muted border-bottom border-4 border-navy pb-2">
          <h5 className="fw-light text-muted me-auto mb-0">Subtasks</h5>
          <Link to={`/tasks/${taskId}/subtasks/add`} className="btn btn-sm btn-outline-success">
            <i className="bi bi-plus-circle me-1"></i>new Subtasks
          </Link>
        </div>
      )}
      {data.length === 0 ? (
        <div className="text-center border-top border-bottom bg-light py-2">
          <small className="text-muted fst-italic">no subtasks</small>
        </div>
      ) : (
        <Table responsive="md" className="mb-0">
          {header && <SubaskHeader />}
          <tbody>
            {data?.map((subtask: SubtaskProps) => <Subtask key={subtask.id} subtask={subtask} submenu={submenu} />)}
          </tbody>
        </Table>
      )}
    </>
  );
}
