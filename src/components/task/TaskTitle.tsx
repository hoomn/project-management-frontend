import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";

import { Table } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import DateTime from "../DateTime";
import Loading from "../Loading";

import { fetchProject } from "../../api/project";

type TaskTitleProps = {
  title: string;
  taskId: number;
  projectId: number;
};

export default function TaskTitle({ taskId, title, projectId }: TaskTitleProps) {
  const authHeader: string = useAuthHeader() || "";

  const {
    isPending,
    isError,
    data: project,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(authHeader, projectId),
  });

  if (isPending) return <Loading />;
  if (isError) return `Error: ${error.message}`;

  return (
    <OverlayTrigger
      overlay={
        <Popover>
          <Popover.Header>Project</Popover.Header>
          <Popover.Body>
            <h6>{project.title}</h6>
            <Markdown>
              {project.description.length > 100 ? project.description.slice(0, 100) + "..." : project.description}
            </Markdown>
            <Table striped bordered size="sm">
              <tbody>
                <tr>
                  <td>Start Date</td>
                  <th>
                    <DateTime dateString={project.start_date} />
                  </th>
                </tr>
                <tr>
                  <td>End Date</td>
                  <th>
                    <DateTime dateString={project.end_date} />
                  </th>
                </tr>
              </tbody>
            </Table>
          </Popover.Body>
        </Popover>
      }
    >
      <Link to={`/tasks/${taskId}`} className="fw-medium">
        {title}
      </Link>
    </OverlayTrigger>
  );
}
