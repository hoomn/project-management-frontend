import UserAvatarList from "../user/UserAvatarList";
import DateTime from "../DateTime";
import Priority from "../Priority";
import Status from "../Status";
import { ProjectProps } from "../../types";
import Description from "../Description";

export default function ProjectDetails({ project }: { project: ProjectProps }) {
  return (
    <div className="row mt-5">
      <div className="col-md-6">
        <p className="text-muted fst-italic fw-light mb-0">Title:</p>
        <div className="mb-4">{project.title}</div>
      </div>
      <div className="col-md-6">
        <p className="text-muted fst-italic fw-light mb-0">Domain:</p>
        <div className="mb-4">{project.domain_title}</div>
      </div>
      <div className="col-md-12 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Description:</p>
        <Description content={project.description} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Start Date:</p>
        <DateTime dateString={project.start_date} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">End Date:</p>
        <DateTime dateString={project.end_date} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Status:</p>
        <Status level={project.status} description={project.get_status_display} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-0">Priority:</p>
        <Priority level={project.priority} description={project.get_priority_display} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-1 me-1">Assigned to:</p>
        <UserAvatarList userIds={project.assigned_to} />
      </div>
      <div className="col-md-6 mb-4">
        <p className="text-muted fst-italic fw-light mb-1 me-1">Owner:</p>
        <UserAvatarList userIds={project.created_by ? [project.created_by] : []} />
      </div>
      <div className="d-flex fst-italic fw-light text-muted py-2">
        <small className="me-auto">Created {project.time_since_creation}</small>
        <small>Last modified {project.time_since_update}</small>
      </div>
    </div>
  );
}
