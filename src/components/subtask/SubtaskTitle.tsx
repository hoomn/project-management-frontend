import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

import { Table } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import DateTime from "../DateTime";
import Loading from "../Loading";

import { fetchTask } from "../../api/task";

export default function SubtaskTitle({ subtask }: { subtask: SubtaskProps }) {
  const authHeader: string = useAuthHeader() || "";

  const {
    isPending,
    isError,
    data: task,
    error,
  } = useQuery({
    queryKey: ["task", subtask.task],
    queryFn: () => fetchTask(authHeader, subtask.task),
  });

  if (isPending) return <Loading />;
  if (isError) return `Error: ${error.message}`;

  return (
    <OverlayTrigger
      overlay={
        <Popover>
          <Popover.Header>Task</Popover.Header>
          <Popover.Body>
            <h6>{task.title}</h6>
            <Markdown>
              {task.description.length > 100 ? task.description.slice(0, 100) + "..." : task.description}
            </Markdown>
            <Table striped bordered size="sm">
              <tbody>
                <tr>
                  <td>Start Date</td>
                  <th>
                    <DateTime dateString={task.start_date} />
                  </th>
                </tr>
                <tr>
                  <td>End Date</td>
                  <th>
                    <DateTime dateString={task.end_date} />
                  </th>
                </tr>
              </tbody>
            </Table>
          </Popover.Body>
        </Popover>
      }
    >
      <Link to={`/subtasks/${subtask.id}`} className="fw-medium">
        {subtask.title}
      </Link>
    </OverlayTrigger>
  );
}
